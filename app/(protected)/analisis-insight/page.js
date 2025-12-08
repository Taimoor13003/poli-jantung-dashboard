// app/analisis-insight/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Halaman Analisis & Insight
 * - Interaktif: filter tahun, dokter, layanan
 * - Men-generate insight otomatis dari dataset (sampleData)
 * - Menyediakan rekomendasi tindakan dan export CSV
 *
 * Ganti `sampleData` dengan data asli dari API / props.
 */

/* ---------- Contoh dataset (mock) ----------
  Struktur tiap record:
  {
    id, date (ISO), doctorCode, doctorName, service, waitMinutes, diagnosis, patientId
  }
*/
const sampleData = [
  { id: 1, date: "2025-01-05", doctorCode: "S299", doctorName: "Dr. A", service: "KARDIOLOGI", waitMinutes: 25, diagnosis: "Hypertension", patientId: "P001" },
  { id: 2, date: "2025-01-07", doctorCode: "S228", doctorName: "Dr. B", service: "KARDIOLOGI", waitMinutes: 12, diagnosis: "Angina", patientId: "P002" },
  { id: 3, date: "2025-02-11", doctorCode: "S299", doctorName: "Dr. A", service: "KARDIOLOGI", waitMinutes: 32, diagnosis: "Heart failure", patientId: "P003" },
  { id: 4, date: "2025-03-05", doctorCode: "S356", doctorName: "Dr. C", service: "ANAK", waitMinutes: 8, diagnosis: "Other", patientId: "P004" },
  { id: 5, date: "2025-07-21", doctorCode: "S299", doctorName: "Dr. A", service: "KARDIOLOGI", waitMinutes: 40, diagnosis: "Hypertension", patientId: "P005" },
  { id: 6, date: "2024-12-12", doctorCode: "S228", doctorName: "Dr. B", service: "KARDIOLOGI", waitMinutes: 10, diagnosis: "Angina", patientId: "P006" },
  { id: 7, date: "2023-06-18", doctorCode: "S424", doctorName: "Dr. D", service: "EEG", waitMinutes: 7, diagnosis: "Other", patientId: "P007" },
  // ... tambahkan data riil di sini
];

function formatNumber(n) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

function monthFromIso(iso) {
  return new Date(iso).getMonth() + 1;
}
function yearFromIso(iso) {
  return new Date(iso).getFullYear();
}

export default function AnalisisInsightPage() {
  // filters
  const years = useMemo(() => {
    const s = new Set(sampleData.map((d) => yearFromIso(d.date)));
    return Array.from(s).sort((a, b) => b - a);
  }, []);
  const doctors = useMemo(() => {
    const map = new Map();
    sampleData.forEach((d) => map.set(d.doctorCode, d.doctorName));
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, []);

  const [filterYear, setFilterYear] = useState(years[0] ?? "");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterService, setFilterService] = useState("");

  // filtered dataset
  const dataFiltered = useMemo(() => {
    return sampleData.filter((d) => {
      if (filterYear && yearFromIso(d.date) !== Number(filterYear)) return false;
      if (filterDoctor && d.doctorCode !== filterDoctor) return false;
      if (filterService && d.service !== filterService) return false;
      return true;
    });
  }, [filterYear, filterDoctor, filterService]);

  // main metrics
  const metrics = useMemo(() => {
    const totalPatients = new Set(dataFiltered.map((d) => d.patientId)).size;
    const totalVisits = dataFiltered.length;
    const avgWait = dataFiltered.length ? dataFiltered.reduce((s, x) => s + x.waitMinutes, 0) / dataFiltered.length : 0;

    // busiest doctor by visits
    const byDoctor = {};
    dataFiltered.forEach((r) => {
      byDoctor[r.doctorCode] = (byDoctor[r.doctorCode] || 0) + 1;
    });
    const busiestDoctorCode = Object.keys(byDoctor).sort((a, b) => (byDoctor[b] || 0) - (byDoctor[a] || 0))[0] || null;
    const busiestDoctorName = busiestDoctorCode ? (doctors.find((d) => d.code === busiestDoctorCode)?.name ?? busiestDoctorCode) : "-";

    // top diagnoses
    const diagCount = {};
    dataFiltered.forEach((r) => { diagCount[r.diagnosis] = (diagCount[r.diagnosis] || 0) + 1; });
    const topDiagnoses = Object.entries(diagCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([diag, c]) => ({ diag, count: c }));

    // monthly trend (for selected year)
    const monthly = new Array(12).fill(0);
    dataFiltered.forEach((r) => {
      const y = yearFromIso(r.date);
      const m = monthFromIso(r.date);
      if (!filterYear || y === Number(filterYear)) monthly[m - 1] += 1;
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

  // automatic insight generator (simple rules)
  const insights = useMemo(() => {
    const res = [];
    // Insight: High wait time
    if (metrics.avgWait > 30) {
      res.push({
        title: "Waktu tunggu rata-rata tinggi",
        text: `Rata-rata waktu tunggu ${Math.round(metrics.avgWait)} menit (di atas ambang 30 menit). Pertimbangkan penjadwalan ulang atau penambahan layanan triase.`,
        severity: "high",
      });
    } else if (metrics.avgWait > 15) {
      res.push({
        title: "Waktu tunggu sedang",
        text: `Rata-rata waktu tunggu ${Math.round(metrics.avgWait)} menit. Periksa jam sibuk dan optimalkan alur pasien.`,
        severity: "medium",
      });
    } else {
      res.push({
        title: "Waktu tunggu baik",
        text: `Rata-rata waktu tunggu ${Math.round(metrics.avgWait)} menit. Terus pertahankan performa ini.`,
        severity: "low",
      });
    }

    // Insight: Busiest doctor
    if (metrics.busiestDoctorCode) {
      res.push({
        title: "Beban dokter tidak merata",
        text: `${metrics.busiestDoctorName} menerima ${metrics.totalVisits ? "" : ""} kunjungan terbanyak pada filter saat ini. Evaluasi redistribusi jadwal untuk mengurangi beban.`,
        severity: "medium",
      });
    }

    // Insight: Top diagnosis
    if (metrics.topDiagnoses.length) {
      const diagList = metrics.topDiagnoses.map((d) => `${d.diag} (${d.count})`).join(", ");
      res.push({
        title: "Penyakit terbanyak",
        text: `Diagnosis terbanyak: ${diagList}. Pertimbangkan stok obat & SOP penatalaksanaan terkait.`,
        severity: "medium",
      });
    }

    // Trend insight simple: upward trend last 3 months
    const m = metrics.monthly;
    const last3 = m.slice(-3);
    if (last3.length === 3 && last3[2] > last3[1] && last3[1] > last3[0] && last3[2] > 0) {
      res.push({
        title: "Tren kunjungan meningkat",
        text: `Ada kenaikan kunjungan berturut-turut dalam 3 bulan terakhir (${last3.join(", ")}). Siapkan kapasitas tambahan.`,
        severity: "high",
      });
    }

    return res;
  }, [metrics]);

  // recommendations (based on insights)
  const recommendations = useMemo(() => {
    const rec = [];
    // from time wait insight
    if (metrics.avgWait > 30) {
      rec.push("Tambahkan slot praktek atau tenaga medis pada jam sibuk (pagi 08:00–11:00).");
      rec.push("Implementasi triase awal untuk kasus non-darurat agar mengurangi beban ruang periksa.");
    } else if (metrics.avgWait > 15) {
      rec.push("Optimalkan alur pasien (registrasi digital, penjadwalan ulang).");
    } else {
      rec.push("Pertahankan performa: evaluasi kebijakan shift tiap 6 bulan.");
    }
    // from busiest doctor
    if (metrics.busiestDoctorCode) {
      rec.push(`Pertimbangkan redistribusi pasien dari ${metrics.busiestDoctorName} atau tambahkan asisten medis.`);
    }
    // stok obat
    if (metrics.topDiagnoses.length) {
      rec.push("Cek ketersediaan obat & kit terkait diagnosis terbanyak; siapkan stok safety level.");
    }
    return rec;
  }, [metrics]);

  // export filtered data to CSV
  function exportCsv() {
    const keys = ["id", "date", "doctorCode", "doctorName", "service", "waitMinutes", "diagnosis", "patientId"];
    const header = keys.join(",");
    const rows = dataFiltered.map((r) => keys.map((k) => `"${String(r[k] ?? "")}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analisis_insight_export_${filterYear || "all"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // small sparkline generator using SVG path (for monthly trend)
  function Sparkline({ data = [], width = 180, height = 40 }) {
    const max = Math.max(...data, 1);
    const min = 0;
    const len = data.length || 1;
    const points = data.map((v, i) => {
      const x = (i / (len - 1 || 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    });
    const path = `M ${points.join(" L ")}`;
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
        <path d={path} fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <div className="page-root">
      <header className="hero">
        <div className="hero-inner">
          <h1>Analisis & Insight</h1>
          <p className="subtitle">Ringkasan analitis, insight otomatis, dan rekomendasi keputusan dari data Poli Jantung.</p>
        </div>
      </header>

      <main className="container">
        <section className="controls">
          <div className="filters">
            <label>
              Tahun
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="">Semua</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>

            <label>
              Dokter
              <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
                <option value="">Semua</option>
                {doctors.map((d) => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
              </select>
            </label>

            <label>
              Layanan
              <select value={filterService} onChange={(e) => setFilterService(e.target.value)}>
                <option value="">Semua</option>
                {Array.from(new Set(sampleData.map(s => s.service))).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <div className="actions">
            <button className="btn" onClick={exportCsv}>Export CSV</button>
            <div className="small-note">Data yang diekspor sesuai filter saat ini.</div>
          </div>
        </section>

        <section className="metrics-grid">
          <div className="metric">
            <div className="metric-title">Total Pasien (unik)</div>
            <div className="metric-value">{formatNumber(metrics.totalPatients)}</div>
            <div className="metric-sub">Kunjungan: {formatNumber(metrics.totalVisits)}</div>
          </div>

          <div className="metric">
            <div className="metric-title">Waktu Tunggu Rata-rata</div>
            <div className="metric-value">{Math.round(metrics.avgWait)} menit</div>
            <div className="metric-sub">Ambang: 30 menit</div>
          </div>

          <div className="metric">
            <div className="metric-title">Dokter Terbanyak</div>
            <div className="metric-value">{metrics.busiestDoctorName}</div>
            <div className="metric-sub">Kode: {metrics.busiestDoctorCode ?? "-"}</div>
          </div>

          <div className="metric">
            <div className="metric-title">Diagnosa Teratas</div>
            <div className="metric-value">
              {metrics.topDiagnoses.length ? metrics.topDiagnoses.map(d => <div key={d.diag}>{d.diag} • {d.count}</div>) : "-"}
            </div>
          </div>
        </section>

        <section className="insights">
          <h2>Insight Otomatis</h2>
          <div className="insight-list">
            {insights.length ? insights.map((it, idx) => (
              <article key={idx} className={`insight-card severity-${it.severity}`}>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </article>
            )) : <p>Tidak ada insight pada filter saat ini.</p>}
          </div>
        </section>

        <section className="recommend">
          <h2>Rekomendasi Tindakan</h2>
          <ol>
            {recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ol>
        </section>

        <section className="trend">
          <h2>Trend Kunjungan Per Bulan (visual)</h2>
          <div className="trend-row">
            <Sparkline data={metrics.monthly} />
            <div className="trend-months">
              {metrics.monthly.map((v, i) => <div key={i} className="trend-month">
                <div className="t-label">{["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][i]}</div>
                <div className="t-value">{v}</div>
              </div>)}
            </div>
          </div>
        </section>

        <section className="notes">
          <h2>Catatan Teknis</h2>
          <ul>
            <li>Semua insight dihasilkan berdasarkan aturan sederhana. Untuk analisis lebih lanjutan, tambahkan model prediktif / statistik.</li>
            <li>Sarankan integrasi API real-time (BigQuery / database) untuk insight yang selalu up-to-date.</li>
            <li>Indikator & threshold dapat disesuaikan dengan KPI rumah sakit.</li>
          </ul>
        </section>
      </main>

      <style jsx>{`
        .page-root {
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #0f172a;
          background: #f3f4f6;
          min-height: 100vh;
        }
        .hero {
          background: linear-gradient(90deg,#0f172a 0%, #2b3f91 40%, #2b59c3 100%);
          color: #fff;
          padding: 48px 0;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          box-shadow: 0 6px 30px rgba(11,20,60,0.45);
        }
        .hero-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px;
          text-align: center;
        }
        .hero h1 {
          margin: 0;
          font-size: 34px;
          font-weight: 800;
        }
        .hero .subtitle {
          margin-top: 10px;
          color: rgba(255,255,255,0.92);
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .container {
          max-width: 1180px;
          margin: 28px auto;
          padding: 0 20px 80px;
        }

        .controls {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .filters { display:flex; gap:12px; align-items:center; }
        .filters label {
          display:flex; flex-direction:column; gap:8px; font-size:13px; color:#334155;
        }
        select { padding:10px 12px; border-radius:8px; border:1px solid #e2e8f0; background:white; min-width:160px; }

        .actions { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
        .btn { background:#2563eb; color:white; padding:10px 14px; border-radius:10px; border:none; cursor:pointer; font-weight:600; }
        .small-note { font-size:12px; color:#6b7280; }

        .metrics-grid {
          display:grid;
          grid-template-columns: repeat(4, 1fr);
          gap:16px;
          margin-bottom:18px;
        }
        .metric { background:white; padding:16px; border-radius:12px; box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
        .metric-title { color:#475569; font-size:13px; }
        .metric-value { font-size:20px; font-weight:700; margin-top:6px; color:#0f172a; }
        .metric-sub { font-size:12px; color:#64748b; margin-top:6px; }

        .insights h2, .recommend h2, .trend h2, .notes h2 { margin-top:22px; margin-bottom:12px; font-size:18px; color:#0b1220; }
        .insight-list { display:grid; grid-template-columns: repeat(2,1fr); gap:12px; }
        .insight-card { padding:14px; border-radius:10px; background:linear-gradient(180deg,#ffffff,#fbfdff); box-shadow: 0 8px 20px rgba(11,20,60,0.06); border-left:4px solid #c7d2fe; }
        .insight-card h3 { margin:0 0 8px 0; font-size:15px; }
        .insight-card p { margin:0; color:#334155; font-size:13px; }
        .insight-card.severity-high { border-left-color:#ef4444; }
        .insight-card.severity-medium { border-left-color:#f59e0b; }
        .insight-card.severity-low { border-left-color:#10b981; }

        .recommend ol { margin:0 0 16px 18px; color:#334155; }
        .trend-row { display:flex; gap:18px; align-items:center; background:white; padding:12px; border-radius:10px; box-shadow: 0 6px 16px rgba(2,6,23,0.04); }
        .trend-months { display:flex; gap:10px; align-items:center; }
        .trend-month { text-align:center; font-size:12px; color:#475569; min-width:44px; }
        .trend-month .t-label { font-weight:600; color:#0b1220; }
        .notes ul { color:#475569; margin-left:18px; }

        @media (max-width: 980px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .insight-list { grid-template-columns: 1fr; }
          .controls { flex-direction:column; align-items:stretch; gap:12px; }
        }
      `}</style>
    </div>
  );
}
