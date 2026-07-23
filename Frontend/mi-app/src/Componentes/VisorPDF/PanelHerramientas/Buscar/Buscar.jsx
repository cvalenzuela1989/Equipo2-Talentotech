
import { MdSearch } from "react-icons/md";
import Formulario from "./Formulario.jsx";
import './style.css'
const Buscar = ({ manejarBusqueda }) => {
    return (
        <div className="buscar-container">

            <div className="buscar-header">
                <MdSearch className="buscar-icono" />
                <h5>Buscar una palabra</h5>
            </div>

            <p className="buscar-descripcion">
                Escriba una palabra para encontrarla dentro del documento.
            </p>

            <Formulario manejarBusqueda={manejarBusqueda} />

        </div>
    );
};

export default Buscar;