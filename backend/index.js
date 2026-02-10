// --- INICIO CONFIGURACIÓN DATADOG ---
const tracer = require('dd-trace').init({
  service: 'react-test-backend', // El nombre que verás en el panel de Datadog
  env: 'production',             // Para filtrar entre dev/prod
  version: '1.0.0',              // Para rastrear despliegues
  logInjection: true             // (Opcional) Une logs con trazas si usas un logger
});
// --- FIN CONFIGURACIÓN DATADOG ---


// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path'); // <--- 1. Importar path

app.use(cors());

// --- Simulamos una pequeña base de datos ---
const pageContent = {
    home: {
        title: "Bienvenido al Dashboard",
        body: "Esta es la página principal. Aquí monitoreamos el estado del sistema.",
        icon: "🏠"
    },
    about: {
        title: "Sobre el Proyecto",
        body: "Esta aplicación está diseñada para probar Datadog APM en una arquitectura distribuida.",
        icon: "ℹ️"
    },
    contact: {
        title: "Contáctanos",
        body: "Envíanos tus dudas a admin@test.com o llámanos al 555-0199.",
        icon: "📞"
    }
};

// 1.--- Endpoints ---
app.get('/api/home', (req, res) => {
    console.log(`[${new Date().toISOString()}] Hit en /api/home`);
    res.json(pageContent.home);
});

app.get('/api/about', (req, res) => {
    console.log(`[${new Date().toISOString()}] Hit en /api/about`);
    res.json(pageContent.about);
});

app.get('/api/contact', (req, res) => {
    console.log(`[${new Date().toISOString()}] Hit en /api/contact`);
    res.json(pageContent.contact);
});

// 2. Servir los archivos estáticos del frontend (la carpeta dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 3. Manejar cualquier otra ruta devolviendo el index.html (para que funcione React Router)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});