const REPORT_URL = 'https://lookerstudio.google.com/embed/reporting/ba317d17-d45b-470f-9ea9-d4ba5be5e940/page/tEnnC';

export default function HomePage() {
  return (
    <main className="container">
      <header className="header">
        <h1>Analytics Dashboard</h1>
        <p>Embedded from Google Looker Studio</p>
      </header>

      <section className="frameWrap" style={{ minHeight: '100vh' }}>
        <iframe
          title="Looker Studio Report"
          src={REPORT_URL}
          frameBorder="0"
          style={{ border: 0, width: '100%', height: '100vh' }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </section>
    </main>
  );
}
