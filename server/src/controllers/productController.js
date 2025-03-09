const Product = require('../models/Product');
const logger = require('../utils/logger');

// Obtener todos los productos
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filtrar por categoría si se proporciona
    if (category && category !== 'Todos') {
      query.category = category;
    }

    // Búsqueda por nombre o código de barras
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { barcode: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query).sort({ name: 1 });
    
    logger.info(`Se obtuvieron ${products.length} productos`);
    res.json(products);
  } catch (error) {
    logger.error(`Error al obtener productos: ${error.message}`);
    next(error);
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      logger.warn(`Producto no encontrado con ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    logger.error(`Error al obtener producto por ID: ${error.message}`);
    next(error);
  }
};

// Obtener un producto por código de barras
exports.getProductByBarcode = async (req, res, next) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    
    if (!product) {
      logger.warn(`Producto no encontrado con código de barras: ${req.params.barcode}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    logger.error(`Error al obtener producto por código: ${error.message}`);
    next(error);
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, category, barcode, stock, image, description } = req.body;
    
    // Verificar si ya existe un producto con ese código de barras
    const existingProduct = await Product.findOne({ barcode });
    if (existingProduct) {
      logger.warn(`Intento de crear producto con código de barras duplicado: ${barcode}`);
      return res.status(400).json({ message: 'Ya existe un producto con ese código de barras' });
    }
    
    const product = new Product({
      name,
      price,
      category,
      barcode,
      stock,
      image,
      description
    });
    
    await product.save();
    logger.info(`Producto creado: ${name}, ID: ${product._id}`);
    res.status(201).json(product);
  } catch (error) {
    logger.error(`Error al crear producto: ${error.message}`);
    next(error);
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, price, category, barcode, stock, image, description } = req.body;
    
    // Verificar si existe otro producto con el mismo código de barras
    if (barcode) {
      const existingProduct = await Product.findOne({ 
        barcode, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingProduct) {
        logger.warn(`Intento de actualizar producto con código de barras duplicado: ${barcode}`);
        return res.status(400).json({ message: 'Ya existe otro producto con ese código de barras' });
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
        barcode,
        stock,
        image,
        description,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      logger.warn(`Producto no encontrado para actualizar con ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    logger.info(`Producto actualizado: ${name}, ID: ${product._id}`);
    res.json(product);
  } catch (error) {
    logger.error(`Error al actualizar producto: ${error.message}`);
    next(error);
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      logger.warn(`Producto no encontrado para eliminar con ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    logger.info(`Producto eliminado: ${product.name}, ID: ${product._id}`);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    logger.error(`Error al eliminar producto: ${error.message}`);
    next(error);
  }
};

// Obtener todas las categorías
exports.getCategories = async (req, res, next) => {
  try {
    // Obtener categorías únicas
    const categories = await Product.distinct('category');
    
    // Agregar "Todos" al principio
    const allCategories = ['Todos', ...categories];
    
    logger.info(`Se obtuvieron ${categories.length} categorías`);
    res.json(allCategories);
  } catch (error) {
    logger.error(`Error al obtener categorías: ${error.message}`);
    next(error);
  }
};