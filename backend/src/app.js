const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error.middleware');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const reportRoutes = require('./routes/report.routes');
const uploadRoutes = require('./routes/upload.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const checkoutController = require('./controllers/checkout.controller');

const app = express();

// Webhook debe ir ANTES de express.json() para recibir el body crudo
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), checkoutController.webhook);

// Middlewares de seguridad y utilidad
app.use(helmet());

// Configuración de CORS dinámica
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://shop-auto.vercel.app', // Asegúrate de que este sea el URL de tu frontend en Vercel
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === '*') {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de depuración para rutas (solo en producción si hay problemas)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Rutas base
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV });
});

// Montar rutas del API
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/checkout', checkoutRoutes);

// Test endpoint para verificar que el prefijo /api funciona
apiRouter.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

app.use('/api', apiRouter);

// Manejador para rutas no encontradas (Debug 404)
app.use((req, res) => {
    console.log(`404 Detectado: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        message: `La ruta ${req.originalUrl} no existe en este servidor.`,
        method: req.method,
        hint: 'Asegúrate de que la URL incluya el prefijo /api si es una ruta de datos.'
    });
});

// Manejo de errores centralizado
app.use(errorHandler);

module.exports = app;
