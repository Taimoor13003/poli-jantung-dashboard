"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// ---------------------------------------------
// PARSER TANGGAL — AMAN UNTUK SEMUA FORMAT
// ---------------------------------------------
function parseDateSafe(input) {
  if (!input) return null;

  // Jika sudah ISO, langsung parse
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
    return new Date(input);
  }

  // Coba parsing DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
    const [d, m, y] = input.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  // Coba parsing YYYY/MM/DD
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(input)) {
    const [y, m, d] = input.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  // Coba parsing MM-DD-YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(input)) {
    const [m, d, y] = input.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // Fallback
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function yearFromIso(str) {
  const d = parseDateSafe(str);
  return d ? d.getFullYear() : null;
}

function monthFromIso(str) {
  const d = parseDateSafe(str);
  return d ? d.getMonth() + 1 : null;
}

// =============================================
// PAGE COMPONENT
// =============================================
export default function AnalisisInsightPage() {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  // ---------------------------------------------
  // FETCH dari BigQuery API (Next.js /api/bigquery)
  // ---------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        setErr("");
        const r = await fetch("/api/bigquery/poli");
        if (!r.ok) throw new Error("Gagal memuat data BigQuery");
        const json = await r.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setErr(e.message);
      }
    }
    load();
  }, []);

  // ---------------------------------------------
  // FILTERS
  // ---------------------------------------------
  const years = useMemo(() => {
    const s = new Set(
      data.map((d) => yearFromIso(d.date)).filter(Boolean)
    );
    return Array.from(s).sort((a, b) => b - a);
  }, [data]);

  const doctors = useMemo(() => {
    const map = new Map();
    data.forEach((d) => map.set(d.doctorCode, d.doctorName));
    return Array.from(map.entries()).map(([code, name]) => ({
      code,
      name,
    }));
  }, [data]);

  const [filterYear, setFilterYear] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterService, setFilterService] = useState("");

  const dataFiltered = useMemo(() => {
    return data.filter((d) => {
      if (filterYear && yearFromIso(d.date) !== Number(filterYear))
        return false;
      if (filterDoctor && d.doctorCode !== filterDoctor) return false;
      if (filterService && d.service !== filterService) return false;
      return true;
    });
  }, [data, filterYear, filterDoctor, filterService]);

  // ---------------------------------------------
  // METRICS
  // ---------------------------------------------
  const metrics = useMemo(() => {
    const totalPatients = new Set(
      dataFiltered.map((d) => d.patientId)
    ).size;

    const totalVisits = dataFiltered.length;

    const avgWait = dataFiltered.length
      ? dataFiltered.reduce(
          (s, x) => s + (Number(x.waitMinutes) || 0),
          0
        ) / dataFiltered.length
      : 0;

    const byDoctor = {};
    dataFiltered.forEach((r) => {
      byDoctor[r.doctorCode] = (byDoctor[r.doctorCode] || 0) + 1;
    });

    const busiestDoctorCode =
      Object.keys(byDoctor).sort(
        (a, b) => (byDoctor[b] || 0) - (byDoctor[a] || 0)
      )[0] || null;

    const busiestDoctorName = busiestDoctorCode
      ? doctors.find((d) => d.code === busiestDoctorCode)?.name ??
        busiestDoctorCode
      : "-";

    const diagCount = {};
    dataFiltered.forEach((r) => {
      diagCount[r.diagnosis] =
        (diagCount[r.diagnosis] || 0) + 1;
    });

    const topDiagnoses = Object.entries(diagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([diag, c]) => ({ diag, count: c }));

    const monthly = new Array(12).fill(0);
    dataFiltered.forEach((r) => {
      const y = yearFromIso(r.date);
      const m = monthFromIso(r.date);
      if (!m) return;
      if (!filterYear || y === Number(filterYear))
        monthly[m - 1] += 1;
    });

    return {
      totalPatients,
      totalVisits,
      avgWait,
      busiestDoctorCode,
      busiestDoctorName,
      topDiagnoses,
      monthly,
    };
  }, [dataFiltered, doctors, filterYear]);

  // ---------------------------------------------
  // INSIGHTS
  // ---------------------------------------------
  const insights = useMemo(() => {
    const res = [];

    if (metrics.avgWait > 30) {
      res.push({
        title: "Waktu tunggu rata-rata tinggi",
        text: `Rata-rata waktu tunggu ${Math.round(
          metrics.avgWait
        )} menit.`,
        severity: "high",
      });
    } else if (metrics.avgWait > 15) {
      res.push({
        title: "Waktu tunggu sedang",
        text: `Rata-rata waktu tunggu ${Math.round(
          metrics.avgWait
        )} menit.`,
        severity: "medium",
      });
    } else {
      res.push({
        title: "Waktu tunggu baik",
        text: `Rata-rata waktu tunggu ${Math.round(
          metrics.avgWait
        )} menit.`,
        severity: "low",
      });
    }

    if (metrics.busiestDoctorCode) {
      res.push({
        title: "Beban dokter tidak merata",
        text: `${metrics.busiestDoctorName} menerima kunjungan terbanyak.`,
        severity: "medium",
      });
    }

    if (metrics.topDiagnoses.length) {
      const diagList = metrics.topDiagnoses
        .map((d) => `${d.diag} (${d.count})`)
        .join(", ");
      res.push({
        title: "Penyakit terbanyak",
        text: `Diagnosis terbanyak: ${diagList}.`,
        severity: "medium",
      });
    }

    const m = metrics.monthly;
    const last3 = m.slice(-3);
    if (
      last3.length === 3 &&
      last3[2] > last3[1] &&
      last3[1] > last3[0] &&
      last3[2] > 0
    ) {
      res.push({
        title: "Tren kunjungan meningkat",
        text: `Kenaikan kunjungan 3 bulan terakhir (${last3.join(
          ", "
        )}).`,
        severity: "high",
      });
    }

    return res;
  }, [metrics]);

  // ---------------------------------------------
  // RECOMMENDATIONS
  // ---------------------------------------------
  const recommendations = useMemo(() => {
    const rec = [];

    if (metrics.avgWait > 30) {
      rec.push("Tambahkan slot praktek pada jam sibuk.");
      rec.push("Implementasi triase awal untuk kasus non-gawat.");
    } else if (metrics.avgWait > 15) {
      rec.push("Optimalkan alur pasien (registrasi digital).");
    } else {
      rec.push("Pertahankan efisiensi waktu tunggu.");
    }

    if (metrics.busiestDoctorCode) {
      rec.push("Evaluasi distribusi jadwal dokter.");
    }

    if (metrics.topDiagnoses.length >= 1) {
      rec.push("Pastikan stok obat pada diagnosis terbanyak.");
    }

    return rec;
  }, [metrics]);

  // ======================================================
  // UI RENDERING
  // ======================================================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analisis & Insight Poli</h1>

      {err && (
        <Card className="border-red-500">
          <CardContent className="p-4 text-red-600">
            Error memuat data: {err}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Data</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Tahun</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Dokter</option>
            {doctors.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Layanan</option>
            {Array.from(new Set(data.map((d) => d.service))).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Data</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100 rounded">
            <div className="text-sm text-gray-500">Total Pasien</div>
            <div className="text-2xl font-bold">{metrics.totalPatients}</div>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <div className="text-sm text-gray-500">Total Kunjungan</div>
            <div className="text-2xl font-bold">{metrics.totalVisits}</div>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <div className="text-sm text-gray-500">Rata-rata Waktu Tunggu</div>
            <div className="text-2xl font-bold">
              {Math.round(metrics.avgWait)} menit
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Kunjungan per Bulan</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics.monthly.map((v, i) => ({
                month: i + 1,
                visits: v,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insight Otomatis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((i, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border ${
                i.severity === "high"
                  ? "border-red-500 bg-red-50"
                  : i.severity === "medium"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-green-500 bg-green-50"
              }`}
            >
              <div className="font-bold">{i.title}</div>
              <div>{i.text}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Sistem</CardTitle>
        </CardHeader>
        <CardContent className="list-disc pl-6 space-y-2">
          {recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
