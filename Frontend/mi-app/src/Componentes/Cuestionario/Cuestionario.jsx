import { useContext, useState } from "react";
import { PdfContext } from "../../Context/PdfContext";
import "./style.css";

function Cuestionario() {
  const { resultado, visible } = useContext(PdfContext);
  const [respuestasAbiertas, setRespuestasAbiertas] = useState({});

  const toggleRespuesta = (index, e) => {
    e.preventDefault();
    setRespuestasAbiertas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!resultado?.quiz) return null;

  return (
    // 🔹 Ocultamos con display: none en vez de desmontar con null
    <div className="contenedor-cuestionario" style={{ display: visible ? 'block' : 'none' }}>
      <div className="encabezado-cuestionario">
        <h2>📝 Cuestionario</h2>
        <p>Poné a prueba lo aprendido con estas preguntas.</p>
      </div>

      {resultado.quiz.map((item, index) => {
        const letras = ["A", "B", "C", "D"];
        const estaAbierta = respuestasAbiertas[index];

        return (
          <div className="pregunta-card" key={index}>
            <h3>{index + 1}. {item.pregunta}</h3>

            {item.opciones.map((opcion, i) => (
              <div className="opcion" key={i}>
                {letras[i]}) {opcion}
              </div>
            ))}

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
                <p className="respuesta" style={{ marginTop: '8px' }}>
                  {item.respuestaCorrecta}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Cuestionario;