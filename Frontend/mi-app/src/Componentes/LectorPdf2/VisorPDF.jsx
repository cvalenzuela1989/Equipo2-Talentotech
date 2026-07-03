import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import SelectorArchivo from './SelectorArchivo';
import PanelHerramientas from './PanelHerramientas';
import HojaTexto from './HojaTexto';
import './style.css';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export default function VisorPdfPersonalizado() {
  const [lineasTexto, setLineasTexto] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [tamanioLetra, setTamanioLetra] = useState(16);
  const [colorFondo, setColorFondo] = useState('#ffffff');
  const [colorTexto, setColorTexto] = useState('#334155');
  
  // 🌟 NUEVO ESTADO: Controla si la ventana lateral de Bootstrap está abierta
  const [menuAbierto, setMenuAbierto] = useState(false);

  const procesarPDF = async (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    setCargando(true);
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

      const lineas = textoAcumulado
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      setLineasTexto(lineas);
    } catch (error) {
      console.error("Error al procesar el PDF:", error);
    } finally {
      setCargando(false);
    }
  };

  const leerTexto = () => {
    speechSynthesis.cancel();
    const textoCompleto = lineasTexto.join(' ');
    const voz = new SpeechSynthesisUtterance(textoCompleto);
    voz.lang = "es-ES";
    speechSynthesis.speak(voz);
  };

  const detenerTexto = () => {
    speechSynthesis.cancel();
  };

  const aplicarTema = (fondo, texto) => {
    谈判 = setColorFondo(fondo);
    setColorTexto(texto);
  };

  return (
    <div className="visor-container" style={{ padding: '20px' }}>
      
      {/* Selector siempre arriba */}
      <SelectorArchivo 
        cargando={cargando} 
        alProcesarPDF={procesarPDF} 
      />

      {lineasTexto.length > 0 && (
        <>
          {/* 🌟 BOTÓN DE CONFIGURACIÓN: Aparece únicamente cuando el PDF ya cargó */}
          <div style={{ margin: '15px 0', textAlign: 'right' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setMenuAbierto(true)}
            >
              ⚙️ Configuración Accesibilidad
            </button>
          </div>

        
          <PanelHerramientas 
            show={menuAbierto}
            handleClose={() => setMenuAbierto(false)}
            tamanioLetra={tamanioLetra}
            setTamanioLetra={setTamanioLetra}
            alEscuchar={leerTexto}
            alDetener={detenerTexto}
            aplicarTema={aplicarTema}
          />

        
          <HojaTexto 
            lineasTexto={lineasTexto}
            colorFondo={colorFondo}
            colorTexto={colorTexto}
            tamanioLetra={tamanioLetra}
          />
        </>
      )}
    </div>
  );
}