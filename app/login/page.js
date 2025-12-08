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
  const [showPassword, setShowPassword] = useState(false); // <- TAMBAHAN

  useEffect(() => {
    if (user) {
      router.replace("/beranda");
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
      router.replace("/beranda");
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

        {/* PANEL KIRI – LOGO */}
        
        <div className="auth-panel auth-panel--info">
          

         <span className="auth-pill"><center>DashWeb Visualisasi Data RS PKU Muhammadiyah</center></span>
          


          <div className="pku-logo-wrapper">
            <img
              src="/logo1.png"
              alt="Logo RS PKU Muhammadiyah Yogyakarta"
              className="pku-logo"
            />
          </div>
        </div>

        {/* PANEL KANAN – FORM LOGIN */}
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

            {/* WRAPPER INPUT PASSWORD + TOMBOL SHOW */}
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="auth-input password-input"
                placeholder="******"
                required
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <div className="auth-meta">
            <p>Butuh akses? Hubungi admin TI rumah sakit Anda.</p>
            <p className="auth-note">
              Pengguna didaftarkan manual melalui Firebase Console.
            </p>
          </div>
        </div>
      </div>

      {/* ==== CSS LANGSUNG DISINI ==== */}
      <style jsx>{`
        .password-wrapper {
          position: relative;
          width: 100%;
        }

        .password-input {
          padding-right: 70px;
        }

        .toggle-password-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 13px;
          cursor: pointer;
          color: #1f3d73;
          font-weight: 600;
        }

        .toggle-password-btn:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
