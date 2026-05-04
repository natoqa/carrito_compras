const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Webhook debe ir ANTES de express.json() para recibir el body crudo
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), require('./controllers/checkout.controller').webhook);

// Middlewares de seguridad y utilidad
app.use(helmet());

// Configuración de CORS dinámica
const corsOptions = {
    origin: process.env.CORS_ORIGIN === '*' ? true : (process.env.CORS_ORIGIN || 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV });
});

// Importar rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/uploads', require('./routes/upload.routes'));
app.use('/api/checkout', require('./routes/checkout.routes'));

// Manejador para rutas no encontradas (Debug 404)
app.use((req, res) => {
    res.status(404).json({ 
        message: `La ruta ${req.originalUrl} no existe en este servidor.`,
        hint: 'Asegúrate de que la URL incluya el prefijo /api si es una ruta de datos.'
    });
});

// Manejo de errores centralizado
app.use(errorHandler);

module.exports = app;
