"use client";

const REPORT_URL = 'https://lookerstudio.google.com/embed/reporting/d8b65737-2cdc-42ad-92dd-de5c4f67ba06/page/GIofF';
export default function DataPasienReport() {
  return (
    <div className="iframe-container">
      <iframe
        width="600" 
        height="500" 
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
