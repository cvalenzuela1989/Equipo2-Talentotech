import { useState, useContext } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Tipografia from "../Tipografia/Tipografia";
import { PdfContext } from "../../../Context/PdfContext"; 
import {
  MdBuild,
  MdPalette,
  MdRecordVoiceOver,
  MdTextFields,
  MdSearch,
  MdSettings,
  MdChevronRight,
  MdFontDownload,
} from "react-icons/md";
import Spinner from "react-bootstrap/Spinner";
import ColorFondo from "./ColorFondo/ColorFondo";
import HerramientaVoz from "../HerramientaVoz/HerramientaVoz";
import TamañoLetra from "./LetraHerramienta/TamañoLetra";
import Resumen from "../Resumir/Resumen";
import Buscar from "./Buscar/Buscar";
import "./style.css";

export default function PanelHerramientas({
  show,
  handleClose,
  tamanioLetra,
  setTamanioLetra,
  alEscuchar,
  alDetener,
  aplicarTemaPDF,
  aplicarTemaFondo,
  aplicarTemaTexto,
  solicitarResumen,
  cambiarLetra,
  borrarFiltros,
  manejarBusqueda,
  enviarDato,
  cargandoResumen: cargandoResumenProp 
}) {
  const [submenuAbierto, setSubmenuAbierto] = useState(null);

  const { 
    enviarDatoFlashCars, 
    cargandoQuiz, 
    cargandoFlashcards, 
    cargandoResumen: cargandoResumenContext,
	pdfData
  } = useContext(PdfContext);

  const cargandoResumenFinal = cargandoResumenProp ?? cargandoResumenContext;

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="start"
      scroll={false}
      backdrop={true}
      className="panel-accesibilidad"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="titulo">Opciones de Accesibilidad</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="panel-body">
        <div className="menu-principal">
        
          <p className="categoria">GENERAL</p>

          <button
            className={`menu-item ${submenuAbierto === "herramientas" ? "activo" : ""}`}
            onClick={() => setSubmenuAbierto("herramientas")}
          >
            <div className="menu-info">
              <MdBuild className="menu-icono" />
              <div>
                <h6 className="tituloia" >Herramientas IA</h6>
                <small> </small>
              </div>
            </div>
            <MdChevronRight className="flecha" />
          </button>
          
          <hr className="separador" />

          <p className="categoria">LECTURA</p>

          <button
            className={`menu-item ${submenuAbierto === "voz" ? "activo" : ""}`}
            onClick={() => setSubmenuAbierto("voz")}
          >
            <div className="menu-info">
              <MdRecordVoiceOver className="menu-icono" />
              <div>
                <h6>Leer documento</h6>
                <small>Texto a voz</small>
              </div>
            </div>
            <MdChevronRight className="flecha" />
          </button>

          <hr className="separador" />

          <p className="categoria">APARIENCIA</p>

          <button
            className={`menu-item ${submenuAbierto === "apariencia" ? "activo" : ""}`}
            onClick={() => setSubmenuAbierto("apariencia")}
          >
            <div className="menu-info">
              <MdPalette className="menu-icono" />
              <div>
                <h6>Apariencia</h6>
                <small>Colores del PDF</small>
              </div>
            </div>
            <MdChevronRight className="flecha" />
          </button>

       
          
           
          <button
            className={`menu-item ${submenuAbierto === "tipografia" ? "activo" : ""}`}
            onClick={() => setSubmenuAbierto("tipografia")}
          >
            <div className="menu-info">
              <MdFontDownload className="menu-icono" />
              <div>
                <h6>Modo Dislexia</h6>
                <small> Cambia la familia tipográfica</small>
              </div>
            </div>
            <MdChevronRight className="flecha" />
          </button>

          <hr className="separador" />

          <p className="categoria">MÁS</p>

          <button
            className={`menu-item ${submenuAbierto === "buscar" ? "activo" : ""}`}
            onClick={() => setSubmenuAbierto("buscar")}
          >
            <div className="menu-info">
              <MdSearch className="menu-icono" />
              <div>
                <h6>Buscar</h6>
                <small>Buscar texto</small>
              </div>
            </div>
            <MdChevronRight className="flecha" />
          </button>

          <button 
            className="menu-item"
            onClick={() => {
                borrarFiltros();
            }}
          >
            <div className="menu-info">
              <MdSettings className="menu-icono" />
              <div>
                <h6>Borrar Preferencias</h6>
                <small>Reinicia las preferencias</small>
              </div>
            </div>
          </button>
        </div>

        <div className="panel-footer">
          <button className="btn-cerrar-panel" onClick={handleClose}>
            Cerrar Panel
          </button>
        </div>

        {submenuAbierto && (
          <div className="submenu">
            <div className="submenu-header">
              <button
                className="btn-volver"
                onClick={() => setSubmenuAbierto(null)}
              >
                ←
              </button>
              <h5>
                {submenuAbierto === "herramientas" && "Herramientas"}
                {submenuAbierto === "voz" && "Lectura"}
                {submenuAbierto === "apariencia" && "Apariencia"}
              
                {submenuAbierto === "tipografia" && "Tipografía"}
                {submenuAbierto === "borrarPreferencias" && "Borrar Preferencias"}
                {submenuAbierto === "buscar" && "Buscar"}
              </h5>
            </div>

            <div className="submenu-body">
              {submenuAbierto === "voz" && (
                <HerramientaVoz
                  alEscuchar={alEscuchar}
                  alDetener={alDetener}
                />
              )}

              {submenuAbierto === "apariencia" && (
               <>
               <ColorFondo
                  aplicarTemaPDF={aplicarTemaPDF}
                  aplicarTemaFondo={aplicarTemaFondo}
                />
                <TamañoLetra
                  tamaño={tamanioLetra}
                  setTamaño={setTamanioLetra}
                  aplicarTemaTexto={aplicarTemaTexto}
                  aplicarTemaPDF={aplicarTemaPDF}
                  />
                  </>
              )}

              {submenuAbierto === "tipografia" && (
                <Tipografia
                  cambiarLetra={cambiarLetra}
                />
              )}

              {submenuAbierto === "herramientas" && (
                <>
                  {/* Integración del Spinner y estado para el Resumen */}
                  <div className="ia-card" style={{ marginBottom: '20px' }}>
                    <h6 className="ia-title">📄 Resumen Automático</h6>
                    <p className="ia-description">Obtén un resumen rápido del documento actual.</p>
                    <button
                      type="button"
                      className="btn-ia btn-resumen"
                      disabled={cargandoResumenFinal}
                      onClick={async (e) => {
                        e.preventDefault();
                        // Asumiendo que solicitarResumen recibe el texto completo del PDF o puedes pasarlo según tu lógica existente
                        await solicitarResumen(pdfData); 
                        handleClose();
                      }}
                    >
                      {cargandoResumenFinal ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Generando Resumen...
                        </>
                      ) : (
                        "✨ Generar Resumen"
                      )}
                    </button>
                  </div>
                   
                  <hr style={{ margin: '20px 0' }} />
                   
                  <div className="ia-card">
                    <h6 className="ia-title">
                        🤖 Herramientas Inteligentes
                    </h6>

                    <p className="ia-description">
                        Genere material de estudio automáticamente a partir del documento.
                    </p>

                    <button
                      type="button"
                      className="btn-ia btn-flashcards"
                      disabled={cargandoFlashcards}
                      onClick={async (e) => {
                          e.preventDefault();
                          await enviarDatoFlashCars();
                          handleClose();
                      }}
                    >
                        {cargandoFlashcards ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Generando Flashcards...
                            </>
                        ) : (
                            "✨ Generar Flashcards"
                        )}
                    </button>
        
                    <button 
                      type="button"
                      className="btn-ia btn-cuestionario"
                      disabled={cargandoQuiz}
                      onClick={async (e) => {
                          e.preventDefault();
                          await enviarDato(e);
                          handleClose();
                      }}
                    >
                        {cargandoQuiz ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Generando Cuestionario...
                            </>
                        ) : (
                            "📝 Generar Cuestionario"
                        )}
                    </button>
                  </div>
                </>
              )}

              
              
              {submenuAbierto === "buscar" && (
                <Buscar manejarBusqueda={manejarBusqueda} />
              )}
            </div>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}