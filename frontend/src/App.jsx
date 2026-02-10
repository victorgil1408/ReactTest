// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

// 1. Componente que carga la información desde el Backend
const PageContent = ({ endpointName }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Limpiamos la data anterior para mostrar "Cargando..." al cambiar de página
    setData(null);

    // Fetch al backend (Asegúrate que tu backend corre en el puerto 3000)
    fetch(`http://localhost:3000/api/${endpointName}`)
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.error("Error conectando al backend:", err));
  }, [endpointName]);

  if (!data) {
    return (
      <div className="card">
        <p>Cargando información del servidor...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <span className="emoji-icon">{data.icon}</span>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
};

// 2. Componente Principal con el Menú
function App() {
  return (
    <Router>
      <div className="app-container">
        
        {/* Menú de Navegación */}
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contacto</Link>
        </nav>

        {/* Definición de Rutas */}
        <Routes>
          {/* Cuando la URL es /, cargamos el endpoint 'home' */}
          <Route path="/" element={<PageContent endpointName="home" />} />
          
          {/* Cuando la URL es /about, cargamos el endpoint 'about' */}
          <Route path="/about" element={<PageContent endpointName="about" />} />
          
          {/* Cuando la URL es /contact, cargamos el endpoint 'contact' */}
          <Route path="/contact" element={<PageContent endpointName="contact" />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;