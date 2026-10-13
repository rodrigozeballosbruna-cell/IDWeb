const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware incorporado
app.use(express.json());

// Middleware personalizado Logger (con tiempo de respuesta en ms)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} en ${req.url} - ${duration}ms`);
  });
  next();
});

// Enrutador de productos
app.use('/api/v1/products', productRoutes);

// Middleware global de Manejo de Errores (código 500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: err.message
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API Express en puerto ${PORT}`));