import Offcanvas from 'react-bootstrap/Offcanvas';
import PaletaColor from '../Paleta/PaletaColor.jsx';
import './style.css';
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
        <div className="grupo-control">
          <h5>Tamaño de Letra</h5>
            <div className="botones">
            <button className="btn " onClick={() => setTamanioLetra(prev => Math.max(12, prev - 2))}>A-</button>
            <p >{tamanioLetra}px</p>
            <button className="btn " onClick={() => setTamanioLetra(prev => prev + 2)}>A+</button>
          </div>
        </div>

       
        <div className="grupo-control">
          <h5>Herramientas de Voz</h5>
          <div className="botones">
            <button className="btn btn-success" onClick={alEscuchar}>Escuchar 🔊</button>
            <button className="btn btn-danger" onClick={alDetener}>Detener 🛑</button>
          </div>
        </div>

        {/* Sección de Temas */}
        <div className="grupo-control">
          <h5>Color de Fondo</h5>
          <div className="botones"> 
            <button onClick={() => aplicarTema('#ffffff', '#334155')} className="btn btn-light border text-start">☀️ Modo Claro</button>
            <button onClick={() => aplicarTema('#f4f1ea', '#433422')} className="btn text-start" style={{ backgroundColor: '#f4f1ea', color: '#433422', border: '1px solid #dcd7ca' }}>📜 Modo Sepia</button>
            <button onClick={() => aplicarTema('#1e293b', '#f8fafc')} className="btn btn-dark text-start">🌙 Modo Oscuro</button>
          </div>
                  </div>
                  <PaletaColor />
              </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}