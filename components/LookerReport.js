"use client";

const REPORT_URL = "https://lookerstudio.google.com/embed/reporting/ba317d17-d45b-470f-9ea9-d4ba5be5e940/page/tEnnC";
export default function LookerReport() {
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
