import React from 'react';
import RenderizarTextoEstilizado from './RenderizarTextoEstilizado';
import './style.css';

function Concentrado({ pdfData, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="zen-overlay" onClick={onClose}>
      <div className="zen-content" onClick={e => e.stopPropagation()}>
        <button className="zen-close-btn" onClick={onClose}>✕</button>
        
        <div className="zen-header">
          <h2>Concentrado del Documento</h2>
        </div>

        <div className="zen-body-scroll">
          {pdfData ? (
            <div className="zen-text-container">
              <RenderizarTextoEstilizado texto={pdfData} />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#555555' }}>
              No hay datos disponibles para mostrar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Concentrado;