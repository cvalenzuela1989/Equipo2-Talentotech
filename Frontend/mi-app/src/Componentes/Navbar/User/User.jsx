import { useState } from 'react';
import './style.css'; 

function User({ userData }) {
    const [isOpen, setIsOpen] = useState(false);
    const {user} =userData
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="menu-container">
    
      <button onClick={toggleMenu} className="menu-trigger-btn">
              {user} ▾
      </button>

     
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => { alert('Perfil'); setIsOpen(false); }}>
            👤 Ver Perfil
          </button>
          <button onClick={() => { alert('Configuración'); setIsOpen(false); }}>
            ⚙️ Configuración
          </button>
          <hr className="dropdown-divider" />
          <button className="text-red" onClick={() => { alert('Cerrar sesión'); setIsOpen(false); }}>
            🚪 Salir
          </button>
        </div>
      )}
    </div>
  );
}
export default User;