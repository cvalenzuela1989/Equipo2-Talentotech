import { useState, useContext } from 'react';
import PanelHerramientas from './PanelHerramientas/PanelHerramientas.jsx';
import HojaTexto from './HojaTexto/HojaTexto.jsx';
import './style.css';
import { ColorContext } from '../../Context/fondoContext.jsx';
import { PdfContext } from '../../Context/PdfContext.jsx';
import { MdStopCircle } from "react-icons/md";
import './styleMenu.css';
import FlashCard from '../FlashCard/FlashCard.jsx';
import Cuestionario from '../Cuestionario/Cuestionario.jsx'
export default function VisorAccesibleLTI() {
  const { pdfData, cargando, error, userData,enviarDato } = useContext(PdfContext);
  const { colorFondo, colorTexto } = useContext(ColorContext);
  const [palabraBuscada, setPalabraBuscada] = useState('');



  const [colorFondoPDF2, setColorFondoPDF2] = useState('#ffffff');
  const [colorTextoPDF2, setColorTextoPDF2] = useState('#1a1a1a');
  const [tamanioLetra, setTamanioLetra] = useState(16);
  const [textoGlobalSeleccionado, setTextoGlobalSeleccionado] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [menuPosicion, setMenuPosicion] = useState(null);
  const [reproduciendoSeleccion, setReproduciendoSeleccion] = useState(false);
 
  const [ tipoLetra, setTipoLetra ] = useState('Nunito');
  
  const [showExplicacionModal, setShowExplicacionModal] = useState(false);
  const [explicacionTexto, setExplicacionTexto] = useState('');
  const [cargandoExplicacion, setCargandoExplicacion] = useState(false);
  
  
  const [tipoModal, setTipoModal] = useState('explicacion');

  
  // Función para solicitar explicación de un fragmento
  const solicitarExplicacion = async (texto) => {
    setCargandoExplicacion(true);
    setTipoModal('explicacion');
    try {
      const response = await fetch('http://localhost:8080/api/v1/explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: texto,
      });
      const data = await response.text();
      setExplicacionTexto(data || "No se recibió respuesta.");
      setShowExplicacionModal(true);
    } catch (error) {
      console.error("Error al pedir explicación:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setCargandoExplicacion(false);
      setMenuPosicion(null); 
    }
  };

  // --- FUNCIÓN PARA RESUMIR EL TEXTO COMPLETO ---
  const solicitarResumen = async (textoCompleto) => {
    setCargandoExplicacion(true);
    setTipoModal('resumen'); 
    try {
      const response = await fetch('http://localhost:8080/api/v1/summarize', { 
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', 
        },
        body: textoCompleto,
      });
      const data = await response.text();
      setExplicacionTexto(data || "No se recibió resumen.");
      setShowExplicacionModal(true);
    } catch (error) {
      console.error("Error al pedir resumen:", error);
      alert("Error al conectar con el servidor para resumir.");
    } finally {
      setCargandoExplicacion(false);
      setMenuPosicion(null);
    }
  };

  // --- LÓGICA DE VOZ Y TEMAS ---
  const leerTexto = () => {
    if (!pdfData) return;
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(pdfData);
    voz.lang = "es-AR";
    speechSynthesis.speak(voz);
  };

  const leerTextoSeleccionado = (texto) => {
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-AR";
    voz.onstart = () => setReproduciendoSeleccion(true);
    voz.onend = () => setReproduciendoSeleccion(false);
    speechSynthesis.speak(voz);
    setMenuPosicion(null);
  };

  const detenerTexto = () => {
    speechSynthesis.cancel();
    setReproduciendoSeleccion(false);
  };

  const aplicarTemaPDF = (fondo, texto) => {
    setColorFondoPDF2(fondo);
    setColorTextoPDF2(texto);
  };

  const aplicarTemafondo = (fondo) => {
    setColorFondoPDF2(fondo);
  };

  const aplicarTematexto = (texto) => {
    setColorTextoPDF2(texto);
  };
  const cambiarLetra = (letra) => {
    setTipoLetra(letra);
  };
 function borrarFiltros(){
    setColorFondoPDF2('#ffffff');
    setColorTextoPDF2('#1a1a1a');
    setTipoLetra('sans-serif');
    setTamanioLetra(16);
    setPalabraBuscada(''); 
 }
 

  const manejarBusqueda = (datosFormulario) => {
  setPalabraBuscada(datosFormulario); 
};
  if (cargando) return <div className="pdf-status">Extrayendo y optimizando el texto para accesibilidad...</div>;
  if (error) return <div className="pdf-status" style={{ color: '#ef4444', padding: '20px' }}><h3>⚠️ Error</h3><p>{error}</p></div>;

  return (
    <div className="visor-container" style={{ padding: '20px', 
      backgroundColor: colorFondo, 
      color: colorTexto, 
      minHeight: '100vh', 
      transition: 'background-color 0.3s ease',
      fontFamily:tipoLetra
    }} onClick={() => setMenuPosicion(null)}>
      {pdfData ? (
        <>
          <div className="info-lti-header text-amber-50" style={{ marginBottom: '15px', color:"#0e0707" }}>
            
          </div>
          
          <div className='botonera'>
            <button className="boton-accesible" onClick={() => setMenuAbierto(true)}>⚙️ Abrir Menú</button>
            <button className="boton-accesible2" onClick={() => setMenuAbierto(false)}>⚙️ Cerrar Menú</button>
         
          </div>
          
         {reproduciendoSeleccion && (
    <button
        className="btn-detener-lectura"
        onClick={detenerTexto}
    >
        <MdStopCircle size={22} />
        <span>Detener lectura</span>
    </button>
)}

        
          {menuPosicion && (
            <div 
                className="menu-flotante" 
                style={{ 
                    top: menuPosicion.y, 
                    left: menuPosicion.x 
                }}
            >
                <button 
                    className="btn-menu-escuchar"
                    onClick={() => leerTextoSeleccionado(textoGlobalSeleccionado)}
                >
                    <span role="img" aria-label="megáfono">📢</span> Escuchar
                </button>

                <button 
                    className="btn-menu-explicar"
                    onClick={() => solicitarExplicacion(textoGlobalSeleccionado)} 
                    disabled={cargandoExplicacion}
                >
                    <span role="img" aria-label="varita mágica">✨</span> 
                    {cargandoExplicacion && tipoModal === 'explicacion' ? "Procesando..." : "Explícamelo"}
                </button>
            </div>
          )}

          <PanelHerramientas
             aplicarTemaFondo={aplicarTemafondo}
             aplicarTemaTexto={aplicarTematexto}
             aplicarTemaPDF={aplicarTemaPDF} 
             show={menuAbierto}
             handleClose={() => setMenuAbierto(false)}
             tamanioLetra={tamanioLetra}
             setTamanioLetra={setTamanioLetra}
             alEscuchar={leerTexto}
             alDetener={detenerTexto}
            solicitarResumen={solicitarResumen}
            cambiarLetra={cambiarLetra}
            borrarFiltros={borrarFiltros}
            manejarBusqueda={manejarBusqueda}
            enviarDato={enviarDato}
           
          />

   
<HojaTexto
    colorFondoPDF={colorFondoPDF2}
    colorTextoPDF={colorTextoPDF2}
    lineasTexto={pdfData.split('\n')}
    colorFondo={colorFondo}
    colorTexto={colorTexto}
    tamanioLetra={tamanioLetra}
    setTextoGlobalSeleccionado={setTextoGlobalSeleccionado}
    setMenuPosicion={setMenuPosicion}
    palabraBuscada={palabraBuscada} 
/>
<div id="contenedor-herramientas" style={{ marginTop: '40px' }}>
    <FlashCard />
    <Cuestionario />
</div>
       
          {showExplicacionModal && (
    <div className="modal-overlay" onClick={() => setShowExplicacionModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{tipoModal === 'resumen' ? 'Resumen del documento' : 'Explicación del fragmento'}</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{explicacionTexto}</p>
            <button onClick={() => setShowExplicacionModal(false)}>Cerrar</button>
        </div>
    </div>
)}
        </>
      ) : (
        <div className="pdf-status">No hay documento para mostrar.</div>
      )}
    </div>
  );
  
}