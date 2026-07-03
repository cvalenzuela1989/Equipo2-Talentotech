import { useContext } from "react"; 
import { ColorContext } from "../../Context/fondoContext";

function PaletaColor() {    
 
  const { colorFondo, setColorFondo, colorTexto, setColorTexto } = useContext(ColorContext);

  return (
    <div> 
    
      <h3>Personalizá el Estilo</h3>
      
      <div >
        <label >Color de Fondo:</label>
        <input 
          type="color" 
          value={colorFondo} 
          onChange={(e) => setColorFondo(e.target.value)} 
        />
      </div>
      <div>
        <label >Color de Letras:</label>
        <input 
          type="color" 
          value={colorTexto} 
          onChange={(e) => setColorTexto(e.target.value)} 
        />
      </div>
    </div>
  );
}

export default PaletaColor;