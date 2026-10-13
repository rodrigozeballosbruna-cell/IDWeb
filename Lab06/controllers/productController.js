let products = require('../data/productData');

// GET /api/v1/products (Soporta query string ?precio=25)
exports.getAllProducts = (req, res) => {
  const { precio } = req.query;
  let resultado = products;

  if (precio) {
    resultado = products.filter(p => p.precio === parseFloat(precio));
  }

  res.status(200).json({ status: 'success', data: resultado });
};

// GET /api/v1/products/:id
exports.getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ status: 'fail', message: 'Producto no encontrado' });
  }

  res.status(200).json({ status: 'success', data: product });
};

// POST /api/v1/products
exports.createProduct = (req, res) => {
  const { nombre, codigo, precio } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !codigo || !precio) {
    return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios (nombre, codigo, precio)' });
  }

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    nombre,
    codigo,
    precio: parseFloat(precio)
  };

  products.push(newProduct);
  res.status(201).json({ status: 'success', data: newProduct });
};

// PUT /api/v1/products/:id
exports.updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'fail', message: 'Producto no encontrado' });
  }

  const { nombre, codigo, precio } = req.body;
  products[index] = {
    ...products[index],
    ...(nombre && { nombre }),
    ...(codigo && { codigo }),
    ...(precio && { precio: parseFloat(precio) })
  };

  res.status(200).json({ status: 'success', data: products[index] });
};

// DELETE /api/v1/products/:id
exports.deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'fail', message: 'Producto no encontrado' });
  }

  products.splice(index, 1);
  res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
};