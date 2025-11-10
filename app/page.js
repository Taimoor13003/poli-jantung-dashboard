"use client";

import LookerReport from "../components/LookerReport";
import { usePathname } from 'next/navigation';

export default function Page() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);


  return (
    <>
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
        <LookerReport key={pathname} />
      </main>
    </>
  );
}
