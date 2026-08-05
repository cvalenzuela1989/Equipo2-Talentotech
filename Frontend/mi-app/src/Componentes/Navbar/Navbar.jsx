import { useContext, useState } from 'react';
import { PdfContext } from '../../Context/PdfContext';
import Concentrado from './Concentrado/Concentrado';
import User from './User/User';
import { MdMenu, MdClose } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pdfData, userData, setMenuAbierto } = useContext(PdfContext); 
  
  return (
    <nav className="nav-links">
      <div className="logo-container">
        <img
          src="/Nexa-Logo.png"
          className="logo"
          alt="Logo Nexa"
        />
      </div>

      <button 
        className="nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        {menuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
      </button>

      <div className={`nav-actions ${menuOpen ? 'open' : ''}`}>
        <button
          className="boton-menu-herramientas"
          onClick={() => {
            setMenuAbierto(true);
            setMenuOpen(false);
          }}
        >
          ⚙️ Abrir Menú de Herramientas
        </button>

        <button
          className="boton-concentrado"
          onClick={() => {
            setShowModal(true);
            setMenuOpen(false);
          }}
        >
          🎯 Modo Concentrado
        </button>

        {userData && <User userData={userData}/>}
      </div>

      {/* 🚀 MOVIMOS EL MODAL AFUERA DE .nav-actions PARA QUE NO SE VEA AFECTADO POR LA ANIMACIÓN DEL MENÚ MÓVIL */}
      <Concentrado
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        pdfData={pdfData}
      />
    </nav>
  );
};

export default Navbar;