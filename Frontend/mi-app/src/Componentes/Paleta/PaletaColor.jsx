import { useContext } from "react"; 
import { ColorContext } from "../../Context/fondoContext";
import './style.css';
function PaletaColor() {    
 
  const { colorFondo, setColorFondo, colorTexto, setColorTexto } = useContext(ColorContext);

  return (
    <div> 
    
      
      
      <div className="paleta-container">
        
        <label > Fondo de la Página</label>
        <input 
          type="color" 
          value={colorFondo} 
          onChange={(e) => setColorFondo(e.target.value)} 
        />
      </div>
     
    </div>
  );
}

export default PaletaColor;