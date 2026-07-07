
import './App.css'
import { ColorProvider } from './Context/fondoContext';
import Navbar from './Componentes/Navbar/Navbar.jsx'


import VisorNuevo from './Componentes/VisorPDF/VisorNuevo.jsx';

function App() {
 

  return (
    <>
      <Navbar />
   
      <ColorProvider>
       
  
      <VisorNuevo />
        
  
      </ColorProvider>
     
    </>
  )
}

export default App
