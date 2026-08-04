import { useContext } from "react"; 
import { ColorContext } from "../../Context/fondoContext";
import './style.css';
function PaletaColor() {    
 
  const { colorFondo, setColorFondo } = useContext(ColorContext);

  return (
    <div> 
    
      
      
      <div className="paleta-container">
        
        <label >Color de fondo de la pagina</label>
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