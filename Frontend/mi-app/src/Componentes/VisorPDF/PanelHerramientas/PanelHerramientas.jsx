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
  enviarDato
}) {
  const [submenuAbierto, setSubmenuAbierto] = useState(null);
  
  // Consumimos la función del contexto global
  const { enviarDatoFlashCars } = useContext(PdfContext);

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
        <Offcanvas.Title>Opciones de Accesibilidad</Offcanvas.Title>
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
                <h6>Herramientas IA</h6>
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
            className={`menu-item ${submenuAbierto === "texto" ? "activo" : ""}`}
            onClick={() => setSubmenuAbierto("texto")}
          >
            <div className="menu-info">
              <MdTextFields className="menu-icono" />
              <div>
                <h6>Tamaño del texto</h6>
                <small>Fuente y tamaño</small>
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
                <h6>Tipografía</h6>
                <small>Familia tipográfica</small>
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
                {submenuAbierto === "texto" && "Tamaño del texto"}
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
                <ColorFondo
                  aplicarTemaPDF={aplicarTemaPDF}
                  aplicarTemaFondo={aplicarTemaFondo}
                />
              )}

              {submenuAbierto === "tipografia" && (
                <Tipografia
                  cambiarLetra={cambiarLetra}
                />
              )}

              {submenuAbierto === "herramientas" && (
                <>
                  <Resumen solicitarResumen={solicitarResumen} />
                  
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
        onClick={async (e) => {
            e.preventDefault();
            await enviarDatoFlashCars();
            handleClose();

            // 🔹 Aumentamos a 300ms para que el Offcanvas termine de cerrarse del todo
            setTimeout(() => {
                requestAnimationFrame(() => {
                    const seccion = document.getElementById("contenedor-herramientas");
                    if (seccion) {
                        const yOffset = -20;
                        const y = seccion.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                });
            }, 300);
        }}
    >
        ✨ Generar Flashcards
    </button>
        
    <button 
        type="button"
        className="btn-ia btn-cuestionario"
        onClick={async (e) => {
            e.preventDefault();
            await enviarDato(e);
            handleClose();

            // 🔹 Mismo cambio acá (300ms)
            setTimeout(() => {
                requestAnimationFrame(() => {
                    const seccion = document.getElementById("contenedor-herramientas");
                    if (seccion) {
                        const yOffset = -20;
                        const y = seccion.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                });
            }, 300);
        }}
    >
        📝 Generar Cuestionario
    </button>

</div>
                </>
              )}

              {submenuAbierto === "texto" && (
                <TamañoLetra
                  tamaño={tamanioLetra}
                  setTamaño={setTamanioLetra}
                  aplicarTemaTexto={aplicarTemaTexto}
                  aplicarTemaPDF={aplicarTemaPDF}
                />
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