export const metadata = {
  title: 'Looker Charts',
  description: 'Embedded Google Looker Studio dashboard',
};

import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
