"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      router.replace("/");
    } catch (err) {
      setError("Email atau password tidak valid.");
      console.error("Failed to sign in", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--split">
        <div className="auth-panel auth-panel--info">
          <span className="auth-pill">DashWeb Suite</span>
          <h1>
            Bangun keputusan klinis yang lebih cepat dengan data Looker Studio yang
            selalu siap.
          </h1>
          <p>
            Dashboard realtime, laporan otomatis, dan insight yang dapat ditindaklanjuti
            untuk seluruh tim rumah sakit Anda.
          </p>

          <ul className="auth-benefits">
            <li>
              <span>📊</span> Ringkasan performa layanan dalam satu tampilan.
            </li>
            <li>
              <span>⚡</span> Akses aman dan cepat dengan autentikasi Firebase.
            </li>
            <li>
              <span>🤝</span> Kolaborasi antar unit tanpa perlu file manual.
            </li>
          </ul>
        </div>

        <div className="auth-panel auth-panel--form">
          <div className="auth-card__header">
            <div className="logo">DashWeb</div>
            <p>Masuk menggunakan kredensial yang telah diberikan.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="nama@rumah-sakit.id"
              required
              value={form.email}
              onChange={handleChange}
            />

            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="******"
              required
              value={form.password}
              onChange={handleChange}
            />

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <div className="auth-meta">
            <p>Butuh akses? Hubungi admin TI rumah sakit Anda.</p>
            <p className="auth-note">Pengguna didaftarkan manual melalui Firebase Console.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
