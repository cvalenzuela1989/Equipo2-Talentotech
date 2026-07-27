import { useContext, useState } from "react";
import { PdfContext } from "../../Context/PdfContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./style.css";

function Cuestionario() {
  const { resultado, visible, setVisible } = useContext(PdfContext);
  const [respuestasAbiertas, setRespuestasAbiertas] = useState({});

  const toggleRespuesta = (index, e) => {
    e.preventDefault();
    setRespuestasAbiertas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!resultado?.quiz) return null;

  const handleCerrarModal = () => {
    setVisible(false); // Cierra el modal modificando el estado del contexto
  };

  return (
    <Modal 
      show={visible} 
      onHide={handleCerrarModal} 
      size="lg" 
      centered
      scrollable
      className="modal-cuestionario"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">📝 Cuestionario</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <p className="text-muted text-center mb-4">Poné a prueba lo aprendido con estas preguntas.</p>

        <div className="contenedor-preguntas-lista">
          {resultado.quiz.map((item, index) => {
            const letras = ["A", "B", "C", "D"];
            const estaAbierta = respuestasAbiertas[index];

            return (
              <div className="pregunta-card mb-4 p-3 border rounded-3 bg-light" key={index}>
                <h5 className="fw-semibold mb-3">{index + 1}. {item.pregunta}</h5>

                <div className="d-flex flex-column gap-2 mb-3">
                  {item.opciones.map((opcion, i) => (
                    <div className="opcion p-2 bg-white rounded border" key={i}>
                      <strong>{letras[i]})</strong> {opcion}
                    </div>
                  ))}
                </div>

                <div className="contenedor-respuesta">
                  <button 
                    type="button" 
                    className="btn-ver-respuesta"
                    onClick={(e) => toggleRespuesta(index, e)}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold', padding: '5px 0' }}
                  >
                    {estaAbierta ? "Ocultar respuesta" : "✅ Ver respuesta"}
                  </button>

                  {estaAbierta && (
                    <p className="respuesta text-success fw-medium mt-2 p-2 bg-white rounded border-start border-success border-4" style={{ marginTop: '8px' }}>
                      {item.respuestaCorrecta}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="danger" className="w-100 rounded-pill py-2 fw-semibold" onClick={handleCerrarModal}>
          Cerrar Cuestionario
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Cuestionario;