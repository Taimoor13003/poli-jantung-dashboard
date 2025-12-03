"use client";

const REPORT_URL = "https://lookerstudio.google.com/embed/reporting/4423bca0-5c1b-4abf-84fa-1711e5ba87db/page/mPugF" ;
export default function EfisiensiLayanan() {
  return (
    <div className="iframe-container">
      <iframe
        width="600"
        height="300"
        src={REPORT_URL}
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        >
      </iframe>
    </div>
  );
}



