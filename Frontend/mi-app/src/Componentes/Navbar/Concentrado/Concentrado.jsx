
import RenderizarTextoEstilizado from './RenderizarTextoEstilizado';
import './style.css';
function Concentrado({ pdfData,isOpen, onClose,  }) {
  


  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div className="modal-body">
          {pdfData ? (
            <div className="concentrado-texto">
              <h2>Concentrado del Documento</h2>
              <RenderizarTextoEstilizado texto={pdfData} />
            </div>
          
            
          ) : (
            <p>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Concentrado;