import { useContext, useState } from "react";
import { PdfContext } from "../../Context/PdfContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './style.css';

function FlashCard() {
    // Asegúrate de incluir la función para cerrar/ocultar en tu contexto si la tienes (ej. setMostrarFlashcards)
    const { resultadoFlashCars, mostrarFlashcards, setMostrarFlashcards } = useContext(PdfContext);
    const [tarjetasVolteadas, setTarjetasVolteadas] = useState([]);

    // Si no hay resultados, no renderizamos nada
    if (!resultadoFlashCars) return null;

    const manejarClickTarjeta = (indice) => {
        if (tarjetasVolteadas.includes(indice)) {
            setTarjetasVolteadas(tarjetasVolteadas.filter(i => i !== indice));
        } else {
            setTarjetasVolteadas([...tarjetasVolteadas, indice]);
        }
    };

    // Función segura para cerrar el modal (si usas el contexto o un estado local)
    const handleCerrarModal = () => {
        if (setMostrarFlashcards) {
            setMostrarFlashcards(false);
        }
    };

    return (
        <Modal 
            show={mostrarFlashcards} 
            onHide={handleCerrarModal} 
            size="lg" 
            centered
            scrollable
            className="modal-flashcards"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">📚 Flashcards Inteligentes</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="px-4 py-3">
                <p className="text-muted text-center mb-4">Haga clic sobre una tarjeta para ver la respuesta.</p>

                <div className="flash-grid">
                    {resultadoFlashCars.map((tarjeta, indice) => {
                        const estaVolteada = tarjetasVolteadas.includes(indice);
                        return (
                            <div
                                key={indice}
                                className={`flashcard ${estaVolteada ? "volteada" : ""}`}
                                onClick={() => manejarClickTarjeta(indice)}
                            >
                                <div className="flash-inner">
                                    <div className="flash-front">
                                        <span className="numero">Flashcard {indice + 1}</span>
                                        <h4>{tarjeta.frente}</h4>
                                    </div>
                                    <div className="flash-back">
                                        <span className="numero">Respuesta</span>
                                        <p>{tarjeta.reverso}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal.Body>

            <Modal.Footer className="border-0">
                <Button variant="danger" className="w-100 rounded-pill py-2 fw-semibold" onClick={handleCerrarModal}>
                    Cerrar Flashcards
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FlashCard;