import DataPasienReport from "../../../components/DataPasienReport";

export default function DataPasien() {


  return (
    <>
      {/* Main Section */}
      <main className="main-content">
        {/* Section Header + Button */}
        <div className="section-header">
          <h1>Data Pasien</h1>
        
        </div>
        {/* Iframe Container */}
       <DataPasienReport/>
      </main>
    </>
  );
}


