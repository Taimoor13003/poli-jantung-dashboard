"use client";

import LookerReport from "../../components/LookerReport";
import { usePathname } from 'next/navigation';

export default function Page() {
  const pathname = usePathname();
  
  return (
    <>
      {/* Main Section */}
      <main className="main-content">
        {/* Section Header + Button */}
        <div className="section-header">
          <h1>Dashboard Poli Pembulu Darah & Jantung</h1>
          
        </div>

        {/* Iframe Container */}
        <LookerReport key={pathname} />
      </main>
    </>
  );
}
