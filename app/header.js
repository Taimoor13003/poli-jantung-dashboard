"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {

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
  }, [])

  return (
   <header className="header">
        <div className="logo">DashWeb</div>

        <nav className="nav">
          <Link href="/">
            <button className="nav-btn active">Dashboard</button>
          </Link>
          <Link href="/data-pasien">
            <button className="nav-btn">Data Pasien</button>
          </Link>
          <Link href="/data-penyakit">
            <button className="nav-btn">Data Penyakit</button>
          </Link>
          <button className="nav-btn">Tenaga Medis</button>
          <button className="nav-btn">Efisiensi Layanan</button>
          <button className="nav-btn">Analisis & Insight</button>
        </nav>

        <div className="user-info">
          <span className="date">{currentDate}</span>
          <div className="profile"></div>
        </div>
    </header>
)
}

