export const metadata = {
  title: 'Looker Charts',
  description: 'Embedded Google Looker Studio dashboard',
};

import '../styles/globals.css';
import { AuthProvider } from '../components/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
