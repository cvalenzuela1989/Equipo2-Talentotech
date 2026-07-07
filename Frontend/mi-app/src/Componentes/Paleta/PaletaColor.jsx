import { useContext } from "react"; 
import { ColorContext } from "../../Context/fondoContext.jsx"; // 🌟 Sincronizado el nombre del archivo y del objeto importado

function PaletaColor() {    
  const { colorFondo, setColorFondo, colorTexto, setColorTexto } = useContext(ColorContext); // 🌟 Asegurate que combine con el nombre del export del Contexto

  return (
    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}> 
      <h3>Personalizá el Estilo Custom</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Color de Fondo:</label>
        <input 
          type="color" 
          value={colorFondo || '#ffffff'} 
          onChange={(e) => setColorFondo && setColorFondo(e.target.value)} 
        />
      </div>
      <div>
        <label style={{ marginRight: '10px' }}>Color de Letras:</label>
        <input 
          type="color" 
          value={colorTexto || '#334155'} 
          onChange={(e) => setColorTexto && setColorTexto(e.target.value)} 
        />
      </div>
    </div>
  );
}

export default PaletaColor;