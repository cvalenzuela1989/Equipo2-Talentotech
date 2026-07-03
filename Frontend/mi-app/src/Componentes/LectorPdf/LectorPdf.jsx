import  { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './style.css';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export default function ExtractorConEstilo() {
  const [lineasTexto, setLineasTexto] = useState([]);
  const [cargando, setCargando] = useState(false);

  const procesarPDF = async (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    setCargando(true);
    setLineasTexto([]);

    try {
      const arrayBuffer = await archivo.arrayBuffer();
      const documentoPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textoAcumulado = '';

      for (let i = 1; i <= documentoPdf.numPages; i++) {
        const pagina = await documentoPdf.getPage(i);
        const contenidoTexto = await pagina.getTextContent();
        const textoPagina = contenidoTexto.items.map(item => item.str).join(' ');
        textoAcumulado += textoPagina + '\n';
      }

      // Separamos el texto por saltos de línea y limpiamos espacios vacíos
      const lineasProcesadas = textoAcumulado
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea.length > 0);

      setLineasTexto(lineasProcesadas);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pdf-page-container">
      <div className="upload-section">
        <h2>Importar Documento PDF</h2>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={procesarPDF} 
          disabled={cargando}
          className="file-input-medical"
        />
        {cargando && <p className="loading-text">Procesando capas de texto...</p>}
      </div>

      {lineasTexto.length > 0 && (
        <div className="extracted-document-card">
          <div className="document-header">
            <h3>Vista de Lectura Optimizada</h3>
            <span className="document-badge">Texto Extraído</span>
          </div>
          
          <hr />

          <div className="document-body-content">
            {lineasTexto.map((linea, index) => {
              
              if (linea.length < 40 && linea === linea.toUpperCase()) {
                return <h4 key={index} className="doc-section-title">{linea}</h4>;
              }
              
              
              if (linea.toLowerCase().includes('importante') || linea.toLowerCase().includes('nota:')) {
                return <p key={index} className="doc-paragraph-highlight">{linea}</p>;
              }

             
              return <p key={index} className="doc-paragraph">{linea}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}