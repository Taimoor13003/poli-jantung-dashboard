"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  // Buat inisial untuk avatar
  const userInitial =
    user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <header className="header">
        <div className="logo">DashWeb</div>

        <nav className="nav">
          <Link href="/beranda">
            <button
              className={`nav-btn ${
                pathname === "/beranda" ? "active" : ""
              }`}
            >
              Beranda
            </button>
          </Link>

          <Link href="/">
            <button
              className={`nav-btn ${pathname === "/" ? "active" : ""}`}
            >
              Dashboard Umum
            </button>
          </Link>

          <Link href="/data-pasien">
            <button
              className={`nav-btn ${
                pathname === "/data-pasien" ? "active" : ""
              }`}
            >
              Data Pasien
            </button>
          </Link>

          <Link href="/data-penyakit">
            <button
              className={`nav-btn ${
                pathname === "/data-penyakit" ? "active" : ""
              }`}
            >
              Data Penyakit
            </button>
          </Link>

          <Link href="/data-tenaga-medis">
            <button
              className={`nav-btn ${
                pathname === "/data-tenaga-medis" ? "active" : ""
              }`}
            >
              Tenaga Medis
            </button>
          </Link>

          <Link href="/efisiensi-layanan">
            <button
              className={`nav-btn ${
                pathname === "/efisiensi-layanan" ? "active" : ""
              }`}
            >
              Efisiensi Layanan
            </button>
          </Link>
          
<Link href="/analisis-insight">
            <button
              className={`nav-btn ${
                pathname === "/analisis-insight" ? "active" : ""
              }`}
            >
              Analisis & Insight
            </button>
          </Link>


         
        </nav>

        <div className="user-section">
          <span className="date">{currentDate}</span>

          {/* AVATAR PROFIL */}
          <div className="profile-wrapper">
            <button
              className="profile-btn"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <div className="profile-circle">{userInitial}</div>
            </button>

            {/* DROPDOWN */}
            {openMenu && (
              <div className="dropdown-menu">
                <p className="dropdown-email">{user?.email}</p>
                <button
                  className="dropdown-logout"
                  onClick={() => signOut()}
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        .profile-wrapper {
          position: relative;
          display: inline-block;
        }

        .profile-btn {
          background: none;
          border: none;
          cursor: pointer;
          margin-left: 16px;
        }

        .profile-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #1d4ed8;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .profile-circle:hover {
          background: #1e40af;
        }

        .dropdown-menu {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          padding: 14px;
          border-radius: 10px;
          width: 180px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.15s ease-in-out;
          z-index: 10;
        }

        .dropdown-email {
          font-size: 14px;
          margin-bottom: 10px;
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 6px;
        }

        .dropdown-logout {
          background: #e63946;
          color: white;
          border: none;
          padding: 8px 12px;
          width: 100%;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .dropdown-logout:hover {
          background: #d62839;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
