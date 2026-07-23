import { useContext, useState } from "react";
import { PdfContext } from "../../Context/PdfContext";
import './style.css';

function FlashCard() {
    const { resultadoFlashCars, mostrarFlashcards } = useContext(PdfContext);
    const [tarjetasVolteadas, setTarjetasVolteadas] = useState([]);

    // 🔹 Si no se deben mostrar, ocultamos con CSS en vez de desmontar con null
    if (!resultadoFlashCars) return null;

    const manejarClickTarjeta = (indice) => {
        if (tarjetasVolteadas.includes(indice)) {
            setTarjetasVolteadas(tarjetasVolteadas.filter(i => i !== indice));
        } else {
            setTarjetasVolteadas([...tarjetasVolteadas, indice]);
        }
    };

    return (
        <div className="flashcards-page" style={{ display: mostrarFlashcards ? 'block' : 'none' }}>
            <div className="flash-header">
                <h2>📚 Flashcards Inteligentes</h2>
                <p>Haga clic sobre una tarjeta para ver la respuesta.</p>
            </div>

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
        </div>
    );
}

export default FlashCard;