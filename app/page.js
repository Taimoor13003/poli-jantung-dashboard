"use client";

const REPORT_URL =
  "https://lookerstudio.google.com/embed/reporting/ba317d17-d45b-470f-9ea9-d4ba5be5e940/page/tEnnC";

export default function Page() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);


  return (
    <div className="dashboard-container">

      {/* Main Section */}
      <main className="main-content">
        {/* Section Header + Button */}
        <div className="section-header">
          <h1>Poli Pembulu Darah & Jantung</h1>
          <select className="section-btn">
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
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

    </div>
  );
}
