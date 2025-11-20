import DataPenyakitReport from "../../components/DataPenyakit";
export default function DataPenyakit() {


  return (
    <>
      {/* Main Section */}
      <main className="main-content">
        {/* Section Header + Button */}
        <div className="section-header">
          <h1>Data Pasien</h1>
        
        </div>
        {/* Iframe Container */}
        <DataPenyakitReport/>
      </main>
    </>
  );
}


