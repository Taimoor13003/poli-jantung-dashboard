import DataTenagaMedis from "../../components/DataTenagaMedis";
export default function DataTenaga() {


  return (
    <>
      {/* Main Section */}
      <main className="main-content">
        {/* Section Header + Button */}
        <div className="section-header">
          <h1>Data Tenaga Medis</h1>
        
        </div>
        {/* Iframe Container */}
       <DataTenagaMedis/>
      </main>
    </>
  );
}