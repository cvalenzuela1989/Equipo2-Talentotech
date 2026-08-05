import { useContext, useState, useEffect } from "react";
import { PdfContext } from "../../Context/PdfContext";
import './style.css';

function Cuestionario() {
  const { resultado, visible, setVisible } = useContext(PdfContext);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});

  useEffect(() => {
    if (visible) {
      console.log("Cuestionario abierto. Estado de visible:", visible);
      console.log("Datos de resultado:", resultado);
    }
  }, [visible, resultado]);

  if (!visible) return null;

  if (!resultado || !resultado.quiz) {
    return (
      <div className="cuestionario-overlay">
        <div className="cuestionario-content" style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Cargando o no se encontró el quiz... 🔍</h2>
          <p>Abre la consola (F12) para ver qué datos están llegando.</p>
          <button className="cuestionario-close-btn" onClick={() => setVisible(false)}>✕</button>
        </div>
      </div>
    );
  }

  
  const totalPreguntas = resultado.quiz.length;
  const respondidas = Object.keys(respuestasSeleccionadas).length;
  const quizTerminado = totalPreguntas > 0 && respondidas === totalPreguntas;

  let cantidadCorrectas = 0;
  
 
  resultado.quiz.forEach((item, index) => {
    const opcionSeleccionada = respuestasSeleccionadas[index];
    if (opcionSeleccionada !== undefined) {
      const correctaStr = String(item?.respuestaCorrecta || "").trim().toLowerCase();
      const seleccionStr = String(opcionSeleccionada || "").trim().toLowerCase();
      
      const esCorrecta = seleccionStr === correctaStr || 
                        (correctaStr && seleccionStr && correctaStr.includes(seleccionStr));
      if (esCorrecta) cantidadCorrectas++;
    }
  });

 
  const notaFinal = totalPreguntas > 0 ? Math.round((cantidadCorrectas / totalPreguntas) * 10) : 0;


  const seleccionarOpcion = (index, opcion) => {
    if (respuestasSeleccionadas[index] !== undefined) return;
    setRespuestasSeleccionadas(prev => ({ ...prev, [index]: opcion }));
  };

  const cerrarCuestionario = () => {
    setVisible(false);
   
    setTimeout(() => setRespuestasSeleccionadas({}), 300);
  };

  return (
    <div className="cuestionario-overlay">
      <div className="cuestionario-content" onClick={e => e.stopPropagation()}>
        <button className="cuestionario-close-btn" onClick={cerrarCuestionario} title="Cerrar">✕</button>
        
        <div className="cuestionario-header">
          <h2>📝 Cuestionario</h2>
          <p>Poné a prueba lo aprendido con estas preguntas.</p>
        </div>

        <div className="cuestionario-body-scroll">
          <div className="contenedor-preguntas-lista">
            {resultado.quiz.map((item, index) => {
              const letras = ["A", "B", "C", "D"];
              const opcionSeleccionada = respuestasSeleccionadas[index];
              const respondida = opcionSeleccionada !== undefined;

              const correctaStr = String(item?.respuestaCorrecta || "").trim().toLowerCase();
              const seleccionStr = String(opcionSeleccionada || "").trim().toLowerCase();
              const opcionTextoStr = (op) => String(op || "").trim().toLowerCase();

              const esCorrecta = respondida && (
                seleccionStr === correctaStr || 
                (correctaStr && seleccionStr && correctaStr.includes(seleccionStr))
              );

              return (
                <div className="pregunta-card" key={index}>
                  <h5>{index + 1}. {item?.pregunta || "Pregunta sin título"}</h5>

                  <div className="opciones-grid">
                    {(item?.opciones || []).map((opcion, i) => {
                      const esEstaSeleccionada = opcionSeleccionada === opcion;
                      let claseExtra = "";

                      if (respondida) {
                        if (esEstaSeleccionada) {
                          claseExtra = esCorrecta ? "opcion-correcta" : "opcion-incorrecta";
                        } else if (opcionTextoStr(opcion) === correctaStr || (correctaStr && opcionTextoStr(opcion).includes(correctaStr))) {
                          claseExtra = "opcion-sugerida-correcta";
                        }
                      }

                      return (
                        <div 
                          className={`opcion ${claseExtra}`} 
                          key={i}
                          onClick={() => seleccionarOpcion(index, opcion)}
                        >
                          <strong>{letras[i]})</strong> {opcion}
                        </div>
                      );
                    })}
                  </div>

                  {respondida && (
                    <div className={`resultado-evaluacion ${esCorrecta ? 'correcta' : 'incorrecta'}`}>
                      {esCorrecta ? (
                        <span>🎉 ¡Correcto! ¡Muy bien!</span>
                      ) : (
                        <span>❌ Incorrecto. La respuesta correcta era: <strong>{item?.respuestaCorrecta || "No especificada"}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

           
            {quizTerminado && (
              <div className="resultados-finales">
                <h3>¡Cuestionario completado! 🎓</h3>
                <div className="resultados-stats">
                  <div className="stat">
                    <span className="stat-label">Respuestas Correctas</span>
                    <span className="stat-value">{cantidadCorrectas} / {totalPreguntas}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Nota Final</span>
                    <span className={`stat-value nota ${notaFinal >= 6 ? 'aprobada' : 'reprobada'}`}>
                      {notaFinal}
                    </span>
                  </div>
                </div>
                <p className="mensaje-final">
                  {notaFinal >= 9 ? "¡Excelente trabajo! Se nota que dominás el tema a la perfección. 🚀" : 
                   notaFinal >= 6 ? "¡Muy bien! Aprobaste, pero siempre podés darle un repasito extra. 👍" : 
                   "¡No te desanimes! Tomate un rato para repasar los conceptos en el modo concentrado y volvé a intentarlo. 💪"}
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cuestionario;