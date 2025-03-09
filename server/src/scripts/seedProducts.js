const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Product = require('../models/Product');
const logger = require('../utils/logger');

const productData = [
  { 
    name: 'Leche', 
    price: 25.50, 
    category: 'Lácteos', 
    barcode: '7501055900039', 
    stock: 50, 
    image: '🥛',
    description: 'Leche entera, 1 litro'
  },
  { 
    name: 'Pan', 
    price: 18.00, 
    category: 'Panadería', 
    barcode: '7501030426035', 
    stock: 30, 
    image: '🍞',
    description: 'Pan blanco, paquete de 680g'
  },
  { 
    name: 'Manzana', 
    price: 12.30, 
    category: 'Frutas', 
    barcode: '0000000001234', 
    stock: 100, 
    image: '🍎',
    description: 'Manzana roja, precio por kg'
  },
  { 
    name: 'Plátano', 
    price: 9.90, 
    category: 'Frutas', 
    barcode: '0000000005678', 
    stock: 80, 
    image: '🍌',
    description: 'Plátano tabasco, precio por kg'
  },
  { 
    name: 'Pollo', 
    price: 89.90, 
    category: 'Carnes', 
    barcode: '7501006559019', 
    stock: 20, 
    image: '🍗',
    description: 'Pollo entero, precio por kg'
  },
  { 
    name: 'Arroz', 
    price: 22.50, 
    category: 'Abarrotes', 
    barcode: '7501008023624', 
    stock: 45, 
    image: '🍚',
    description: 'Arroz blanco, 1kg'
  },
  { 
    name: 'Pasta', 
    price: 15.80, 
    category: 'Abarrotes', 
    barcode: '7501000911301', 
    stock: 35, 
    image: '🍝',
    description: 'Pasta tipo espagueti, 500g'
  },
  { 
    name: 'Queso', 
    price: 45.00, 
    category: 'Lácteos', 
    barcode: '7501055901012', 
    stock: 25, 
    image: '🧀',
    description: 'Queso panela, 400g'
  },
  { 
    name: 'Yogurt', 
    price: 18.90, 
    category: 'Lácteos', 
    barcode: '7501055902095', 
    stock: 40, 
    image: '🥛',
    description: 'Yogurt natural, 1kg'
  },
  { 
    name: 'Refresco', 
    price: 17.50, 
    category: 'Bebidas', 
    barcode: '7501055363513', 
    stock: 60, 
    image: '🥤',
    description: 'Refresco de cola, 600ml'
  }
];

async function seedProducts() {
  try {
    logger.info('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Conexión exitosa!');
    
    // Eliminar productos existentes
    await Product.deleteMany({});
    logger.info('Productos anteriores eliminados');
    
    // Insertar nuevos productos
    await Product.insertMany(productData);
    logger.info(`${productData.length} productos insertados correctamente`);
    
  } catch (error) {
    logger.error(`Error al sembrar productos: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    logger.info('Desconectado de MongoDB');
  }
}

seedProducts();