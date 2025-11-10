"use client";

import { useEffect, useState } from "react";

const REPORT_URL =
  "https://lookerstudio.google.com/embed/reporting/ba317d17-d45b-470f-9ea9-d4ba5be5e940/page/tEnnC";

export default function Page() {
  const [currentDate, setCurrentDate] = useState("");

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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="logo">DashWeb</div>

        <nav className="nav">
          <button className="nav-btn active">Dashboard</button>
          <button className="nav-btn">Data Pasien</button>
          <button className="nav-btn">Data Penyakit</button>
          <button className="nav-btn">Tenaga Medis</button>
          <button className="nav-btn">Efisiensi Layanan</button>
          <button className="nav-btn">Analisis & Insight</button>
        </nav>

        <div className="user-info">
          <span className="date">{currentDate}</span>
          <div className="profile"></div>
        </div>
      </header>

      {/* Main Section */}
      <main className="main-content">
        {/* Section Header + Button */}
        <div className="section-header">
          <h1>Poli Pembulu Darah & Jantung</h1>
          <button className="section-btn">Tahun</button>
        </div>

        {/* Iframe Container */}
        <div className="iframe-container">
          <iframe
            title="Looker Studio Report"
            src={REPORT_URL}
            frameBorder="0"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: system-ui, sans-serif;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0f172a;
          color: white;
          padding: 16px 24px;
        }

        .logo {
          font-weight: 600;
          font-size: 1.2rem;
        }

        .nav {
          display: flex;
          gap: 12px;
        }

        .nav-btn {
          background: transparent;
          color: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-btn.active {
          background: #2563eb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .date {
          font-size: 0.9rem;
          color: #ffffffff;
          text-transform: capitalize;
        }

        .profile {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffffff;
        }

        .main-content {
          flex: 1;
          padding: 24px;
          background: #f8fafc;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0px;
        }

        .section-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .section-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .section-btn:hover {
          background: #1d4ed8;
        }

        .iframe-container {
          width: 100%;
          height: calc(150vh - 200px);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
}
