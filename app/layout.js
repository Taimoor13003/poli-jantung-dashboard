export const metadata = {
  title: 'Looker Charts',
  description: 'Embedded Google Looker Studio dashboard',
};

import '../styles/globals.css';
import Header from './header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
