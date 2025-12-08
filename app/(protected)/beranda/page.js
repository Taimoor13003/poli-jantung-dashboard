"use client";

export default function Home() {
  return (
    <div className="homepage">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Inter", sans-serif;
        }

        .homepage {
          background: #f4f6fc;
          min-height: 100vh;
          color: #0f1a3c;
        }

        /* ================= HERO ================= */
        .hero {
          width: 100%;
          padding: 70px 20px;
          background: linear-gradient(135deg, #0f1a3c, #4158d0);
          color: white;
          text-align: center;
          border-bottom-left-radius: 45px;
          border-bottom-right-radius: 45px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .hero h1 {
          font-size: 38px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .hero p {
          font-size: 18px;
          opacity: 0.9;
          max-width: 780px;
          margin: auto;
          line-height: 1.6;
        }

        /* ================= CONTENT SECTION ================= */
        .section {
          max-width: 1100px;
          margin: 40px auto;
          padding: 20px 25px;
        }

        .card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
          border-left: 6px solid #4158d0;
        }

        .card h2 {
          font-size: 26px;
          margin-bottom: 14px;
          color: #0f1a3c;
        }

        .card p {
          font-size: 16px;
          line-height: 1.7;
        }

        /* ================= FOOTER ================= */
        .footer {
          margin-top: 50px;
          padding: 25px;
          text-align: center;
          font-size: 14px;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 28px;
          }
          .hero p {
            font-size: 15px;
          }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="hero">
        <h1>Dashboard Poli Pembuluh Darah & Jantung</h1>
        <p>
          Sistem visualisasi data modern untuk membantu RS PKU Muhammadiyah
          Yogyakarta dalam memantau data pasien, dokter, layanan, dan statistik
          kesehatan secara cepat, akurat, dan interaktif.
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="section">
        {/* Card 1 */}
        <div className="card">
          <h2>Apa Isi Dashboard Ini?</h2>
          <p>
            Dashboard ini menampilkan informasi lengkap terkait pelayanan Poli
            Jantung & Pembuluh Darah, termasuk total pasien, jumlah kunjungan,
            jenis layanan, penyakit terbanyak, profil demografi pasien, hingga
            tren kunjungan per bulan dan per tahun. Semua data dirancang agar
            mudah dipahami oleh tenaga medis maupun manajemen rumah sakit.
          </p>
        </div>

        {/* Card 2 */}
        <div className="card">
          <h2>Mengapa Dashboard Ini Penting?</h2>
          <p>
            Visualisasi data membantu proses pengambilan keputusan menjadi lebih
            cepat dan tepat. Dengan tampilan yang ringkas dan interaktif,
            dashboard ini memudahkan analisis beban kerja, prediksi tren
            kesehatan, serta optimalisasi layanan kardiologi di rumah sakit.
          </p>
        </div>

        {/* Card 3 */}
        <div className="card">
          <h2>Siapa yang Bisa Menggunakan Dashboard Ini?</h2>
          <p>
            Dashboard ini dapat dimanfaatkan oleh tim manajemen, dokter spesialis
            jantung, bagian rekam medis, serta unit pelayanan kesehatan lain
            yang membutuhkan informasi real-time untuk meningkatkan kualitas
            pelayanan pasien.
          </p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="footer">
        © 2025 Dashboard Poli Jantung RS PKU Muhammadiyah Yogyakarta
      </div>
    </div>
  );
}
