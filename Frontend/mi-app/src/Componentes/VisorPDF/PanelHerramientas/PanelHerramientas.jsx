import Offcanvas from 'react-bootstrap/Offcanvas';
import PaletaColor from '../../Paleta/PaletaColor.jsx';
import '../../VisorPDF/style.css';
import ColorFondo from './ColorFondo.jsx';
import HerramientaVoz from './HerramientaVoz.jsx';
import TamañoLetra from './TamañoLetra.jsx';
export default function PanelHerramientas({ 
  show, 
  handleClose, 
  tamanioLetra, 
  setTamanioLetra, 
  alEscuchar, 
  alDetener, 
  aplicarTema 
}) {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" className="form-panel">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Opciones de Accesibilidad ⚙️</Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body >
        
              <div className="form-panel">
     <TamañoLetra tamaño={tamanioLetra} setTamaño={setTamanioLetra} />

       
        <div className="grupo-control">
          <h5>Herramientas de Voz</h5>
          <HerramientaVoz alEscuchar={alEscuchar} alDetener={alDetener} />
        </div>

        {/* Sección de Temas */}
        <div className="grupo-control">
          <h5>Color de Fondo</h5>
          <ColorFondo aplicarTema={aplicarTema} />
                  </div>
                  <PaletaColor />
              </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}