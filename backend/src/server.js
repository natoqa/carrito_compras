const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});

// Manejo de cierres limpios
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado.');
        process.exit(0);
    });
});
