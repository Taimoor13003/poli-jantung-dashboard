"use client";

const REPORT_URL = "https://lookerstudio.google.com/embed/reporting/db3bcdee-d13e-41b7-8acf-4653c63a6059/page/lhGgF" ;
export default function DataTenagaMedis() {
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







