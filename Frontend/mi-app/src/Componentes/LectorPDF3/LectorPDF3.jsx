function LectorPDF3() {
  // esto es usando pdfslick
    return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "15px", color: "#333" }}>
        Visualizador de Apuntes
      </h2>

   
      <div >
        <iframe
          src="/01. TP integrador Esutdios judaicos 2024.pdf"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Visualizador PDF"
        />
        </div>
        <input type="color"></input>
    </div>
  );
}

export default LectorPDF3;