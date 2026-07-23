import { useState } from "react";
import { MdSearch } from "react-icons/md";
import './style.css'
const Formulario = ({ manejarBusqueda }) => {
    const [form, setForm] = useState("");

    const handleChange = (e) => {
        setForm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.trim() === "") {
            alert("Ingrese una palabra para buscar.");
            return;
        }

        manejarBusqueda(form);
        setForm("");
    };

    return (
        <form onSubmit={handleSubmit} className="buscar-form">

            <input
                type="text"
                value={form}
                onChange={handleChange}
                placeholder="Buscar en el documento..."
                className="buscar-input"
            />

            <button
                type="submit"
                className="buscar-btn"
            >
                <MdSearch size={20}/>
                Buscar
            </button>

        </form>
    );
};

export default Formulario;