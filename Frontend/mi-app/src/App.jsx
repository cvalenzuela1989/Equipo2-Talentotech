

import './App.css'




import PaletaColor from './Componentes/Paleta/PaletaColor.jsx'
import { ColorProvider } from './Context/fondoContext';
import Navbar from './Componentes/Navbar/Navbar.jsx'

import VisorPDF from './Componentes/LectorPdf2/VisorPDF.jsx';
function App() {
 

  return (
    <>
      <Navbar/>
      <ColorProvider>
        
  
      <VisorPDF />
        
  
      </ColorProvider>
     
    </>
  )
}

export default App
