"use client";

const REPORT_URL = "https://lookerstudio.google.com/embed/reporting/cc99457b-20fa-4806-aec6-06b00e491adf/page/9MOfF";
export default function DataPasienReport() {
  return (
    <div className="iframe-container">
      <iframe
        title="Looker Studio Report"
        src={REPORT_URL}
        frameBorder="0"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
}
