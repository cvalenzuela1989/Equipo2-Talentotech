import  { useState } from 'react';

export default function LectorTexto() {
  //
  const [texto, setTexto] = useState('¡Hola Grupo2! Felicitaciones estar en innovalab.');
 
  const [leyendo, setLeyendo] = useState(false);

  const hablar = () => {
    // 1. Validar que el navegador soporte la Web Speech API
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta la lectura de texto nativa. Probá con Chrome o Edge.');
      return;
    }

  
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setLeyendo(false);
      return;
    }

    const mensaje = new SpeechSynthesisUtterance(texto);

    
    mensaje.lang = 'es-AR'; // Podés usar 'es-ES' o 'es-MX' según el acento que prefieras

    // Configurar velocidad (opcional: 1 es normal, 1.5 más rápido, 0.8 más lento)
    mensaje.rate =1; 

  
    mensaje.onstart = () => setLeyendo(true);
    mensaje.onend = () => setLeyendo(false);
    mensaje.onerror = () => setLeyendo(false);

   
    window.speechSynthesis.speak(mensaje);
  };

  return (
    <div style={styles.contenedor}>
      <h2>Lector de Texto a Voz (TTS)</h2>
      
      <textarea
        style={styles.inputTexto}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribí acá lo que quieras que lea la PC..."
        rows={4}
      />

      <button 
        style={{
          ...styles.boton, 
          backgroundColor: leyendo ? '#dc3545' : '#007bff'
        }} 
        onClick={hablar}
      >
        {leyendo ? '🛑 Detener Lectura' : '🔊 Escuchar Texto'}
      </button>
    </div>
  );
}

// Estilos rápidos en línea para que quede prolijo
const styles = {
  contenedor: {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputTexto: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #aaa',
    boxSizing: 'border-box',
    fontSize: '16px',
    resize: 'vertical'
  },
  boton: {
    padding: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  }
};