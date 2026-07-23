import { useContext, useState } from 'react';
import { PdfContext } from '../../Context/PdfContext';
import Concentrado from './Concentrado/Concentrado';
import User from './User/User';
import './Navbar.css';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const { pdfData, userData } = useContext(PdfContext); 
  
  return (
   <nav className="nav-links">

    <div className="logo-container">
        <img
            src="../../../public/Nexa-Logo.png"
            className="logo"
            alt="Logo Nexa"
        />
    </div>

    <div className="nav-actions">

        <button
            className="boton-concentrado"
            onClick={() => setShowModal(true)}
        >
            🎯 Modo Concentrado
        </button>

        <Concentrado
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            pdfData={pdfData}
        />

        {userData && <User userData={userData}/>}

    </div>

</nav>
  );
};

export default Navbar;
