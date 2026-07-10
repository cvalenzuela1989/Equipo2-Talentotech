import { useState, useEffect, useContext } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import PanelHerramientas from './PanelHerramientas/PanelHerramientas.jsx';
import HojaTexto from './HojaTexto';
import './style.css';
import { ColorContext } from '../../Context/fondoContext.jsx'; // 🌟 Asegurate que combine con el nombre del export del Contexto

// Configuración del Worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export default function VisorAccesibleLTI() {
  // 🌟 Extraemos los setters del contexto para poder mutarlos desde los botones rápidos
  const { colorFondo, setColorFondo, colorTexto, setColorTexto } = useContext(ColorContext);
  
  const [studentData, setStudentData] = useState(null);
  const [lineasTexto, setLineasTexto] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorPlataforma, setErrorPlataforma] = useState(null); 
  const [tamanioLetra, setTamanioLetra] = useState(16);
  const [textoGlobalSeleccionado, setTextoGlobalSeleccionado] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Estados para el menú contextual flotante y reproducción de voz
  const [menuPosicion, setMenuPosicion] = useState(null); 
  const [reproduciendoSeleccion, setReproduciendoSeleccion] = useState(false);

  // 1. CAPTURA DE PARÁMETROS LTI DE MOODLE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const userId = params.get('userId');
    const user = params.get('user');
    const email = params.get('email');
    const course = params.get('course');
    const section = params.get('section');
    const pdfUrl = params.get('pdfUrl');

    if (userId && pdfUrl) {
      setStudentData({ userId, user, email, course, section, pdfUrl });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 2. PROCESAMIENTO AUTOMÁTICO DEL PDF
  useEffect(() => {
    if (!studentData || !studentData.pdfUrl) return;

      const procesarPdfDesdeUrl = async () => {
          setCargando(true);
          setErrorPlataforma(null);
          try {
              const urlMoodleEncodada = encodeURIComponent(studentData.pdfUrl);
              const urlTuApi = `/api/v1/view?fileUrl=${urlMoodleEncodada}`;

              const res = await fetch(urlTuApi);
              if (!res.ok) throw new Error(`Error de red: servidor respondió con estado ${res.status}`);
        
              const arrayBuffer = await res.arrayBuffer();
              const decodificador = new TextDecoder("utf-8");
              const inicioTexto = decodificador.decode(new Uint8Array(arrayBuffer.slice(0, 10))).trim();

              if (!inicioTexto.startsWith("%PDF")) {
                  const textoRespuesta = decodificador.decode(new Uint8Array(arrayBuffer));
                  console.error("El backend no devolvió un PDF. Respuesta recibida:", textoRespuesta);
                  try {
                      const jsonError = JSON.parse(textoRespuesta);
                      throw new Error(jsonError.error || "Error devuelto por la plataforma de estudio.");
                  } catch (e) {
                      throw new Error("El servidor no envió un documento válido.");
                  }
              }

              const documentoPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              let textoAcumulado = '';

              for (let i = 1; i <= documentoPdf.numPages; i++) {
                  const pagina = await documentoPdf.getPage(i);
                  const contenidoTexto = await pagina.getTextContent();
                  const textoPagina = contenidoTexto.items.map(item => item.str).join(' ');
                  textoAcumulado += textoPagina + '\n';
              }

              // 🌟 LOGICA DE FORMATEO AVANZADO:
              // 1. Buscamos puntos seguidos de un espacio (punto y aparte/seguido significativo) y agregamos un salto.
              // 2. Buscamos signos de interrogación de cierre (?) o exclamación (!) para segmentar oraciones interactivas.
              let textoFormateado = textoAcumulado
                  .replace(/\. +/g, '.\n')   // Si hay un punto seguido de uno o más espacios, mete un salto
                  .replace(/\? +/g, '?\n')   // Si termina una pregunta y sigue texto, mete un salto
                  .replace(/\! +/g, '!\n');  // Si termina una exclamación y sigue texto, mete un salto

              // Generamos el array de líneas filtrando los renglones vacíos
              const lineas = textoFormateado
                  .split('\n')
                  .map(l => l.trim())
                  .filter(l => l.length > 0);
          
              setLineasTexto(lineas);

          } catch (error) {
              console.error("Error automatizado al procesar el PDF LTI:", error);
              setErrorPlataforma(error.message);
          } finally {
              setCargando(false);
          }
      }
    procesarPdfDesdeUrl();
  }, [studentData]);

  // Lógica de Síntesis de Voz
  const leerTexto = () => {
    speechSynthesis.cancel();
    const textoCompleto = lineasTexto.join(' ');
    const voz = new SpeechSynthesisUtterance(textoCompleto);
    voz.lang = "es-AR"; 
    speechSynthesis.speak(voz);
  };

  const leerTextoSeleccionado = (texto) => {
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-AR";
    
    voz.onstart = () => setReproduciendoSeleccion(true);
    voz.onend = () => setReproduciendoSeleccion(false);
    voz.onerror = () => setReproduciendoSeleccion(false);

    speechSynthesis.speak(voz);
    setMenuPosicion(null); 
  };

  const detenerTexto = () => {
    speechSynthesis.cancel();
    setReproduciendoSeleccion(false);
  };

  // 🌟 CORRECCIÓN: Ahora actualiza directamente las propiedades globales del contexto
  const aplicarTema = (fondo, texto) => {
    if (colorFondo === fondo) {
      setImageDefault(); // Si ya está seleccionado, vuelve al original
    } else {
      setImageTema(fondo, texto);
    }
  };

  const setImageTema = (fondo, texto) => {
    if (typeof setColorFondo === 'function' && typeof setColorTexto === 'function') {
      setImageColors(fondo, texto);
    }
  };

  const setImageColors = (fondo, texto) => {
    if(typeof setColorFondo === 'function') setColorFondo(fondo);
    if(typeof setColorTexto === 'function') setColorTexto(texto);
  };

  const setImageDefault = () => {
    if(typeof setColorFondo === 'function') setColorFondo('#ffffff');
    if(typeof setColorTexto === 'function') setColorTexto('#334155');
  };

  if (!studentData) {
    return <div className="pdf-status">Esperando inicialización desde la plataforma Moodle...</div>;
  }

  if (cargando) {
    return <div className="pdf-status">Extrayendo y optimizando el texto del documento para accesibilidad...</div>;
  }

  if (errorPlataforma) {
    return (
      <div className="pdf-status" style={{ color: '#ef4444', padding: '20px' }}>
        <h3>⚠️ Error de Comunicación</h3>
        <p>{errorPlataforma}</p>
        <small>Asegurate de haber lanzado la sesión correctamente desde tu curso de Moodle.</small>
      </div>
    );
  }

  return (
    <div className="visor-container" style={{ padding: '20px' }} onClick={() => setMenuPosicion(null)}>
      {lineasTexto.length > 0 ? (
        <>
          <div className="info-lti-header" style={{ marginBottom: '15px', color: colorTexto }}>
            <h2>{studentData.section || 'Documento del Curso'}</h2>
            <p>Usuario: {studentData.user} | Curso: {studentData.course}</p>
          </div>

          <div style={{ margin: '15px 0', textAlign: 'right' }}>
            <button className="boton-accesible" onClick={() => setMenuAbierto(true)}>
              ⚙️ Configuración Accesibilidad
            </button>
          </div>

          {reproduciendoSeleccion && (
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <button className="boton-dinamico" onClick={detenerTexto}>
                🛑 Detener Lectura
              </button>
            </div>
          )}

          {menuPosicion && (
            <div 
              style={{ position: 'fixed', top: `${menuPosicion.y}px`, left: `${menuPosicion.x}px`, background: '#22252a', color: '#fff', border: '1px solid #444', borderRadius: '6px', padding: '5px 0', zIndex: 1500, boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="boton-dinamico-escuchar" onClick={() => leerTextoSeleccionado(textoGlobalSeleccionado)}>
                📢 Escuchar Selección
              </button>
            </div>
          )}

          <PanelHerramientas
            show={menuAbierto}
            handleClose={() => setMenuAbierto(false)}
            tamanioLetra={tamanioLetra}
            setTamanioLetra={setTamanioLetra}
            alEscuchar={leerTexto}
            alDetener={detenerTexto}
            aplicarTema={aplicarTema}
          />

          {/* 🌟 Pasamos de forma transparente las variables del Contexto */}
          <HojaTexto
            lineasTexto={lineasTexto}
            colorFondo={colorFondo}
            colorTexto={colorTexto}
            tamanioLetra={tamanioLetra}
            setTextoGlobalSeleccionado={setTextoGlobalSeleccionado}
            setMenuPosicion={setMenuPosicion}
          />
        </>
      ) : (
        <div className="pdf-status">El archivo está vacío o no contiene capas de texto procesables.</div>
      )}
    </div>
  );
}
