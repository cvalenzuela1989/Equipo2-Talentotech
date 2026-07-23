import { useState } from 'react';
import './style.css'; // O tus estilos correspondientes

function User({ userData }) {
    const [isOpen, setIsOpen] = useState(false);
    const {user, email} =userData
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="menu-container">
      {/* Botón principal que activa el menú */}
      <button onClick={toggleMenu} className="menu-trigger-btn">
              {user} ▾
      </button>

      {/* Menú desplegable condicional */}
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