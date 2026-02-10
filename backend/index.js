// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

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

// --- Endpoints ---
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

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});