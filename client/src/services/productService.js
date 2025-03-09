import api from './api';

const productService = {
  // Obtener todos los productos (con posibilidad de filtrado)
  getAllProducts: async (filters = {}) => {
    try {
      // Versión Mock para desarrollo
      const mockProducts = [
        { id: 1, name: 'Leche', price: 25.50, category: 'Lácteos', barcode: '7501055900039', stock: 50, image: '🥛' },
        { id: 2, name: 'Pan', price: 18.00, category: 'Panadería', barcode: '7501030426035', stock: 30, image: '🍞' },
        { id: 3, name: 'Manzana', price: 12.30, category: 'Frutas', barcode: '0000000001234', stock: 100, image: '🍎' },
        { id: 4, name: 'Plátano', price: 9.90, category: 'Frutas', barcode: '0000000005678', stock: 80, image: '🍌' },
        { id: 5, name: 'Pollo', price: 89.90, category: 'Carnes', barcode: '7501006559019', stock: 20, image: '🍗' },
        { id: 6, name: 'Arroz', price: 22.50, category: 'Abarrotes', barcode: '7501008023624', stock: 45, image: '🍚' },
        { id: 7, name: 'Pasta', price: 15.80, category: 'Abarrotes', barcode: '7501000911301', stock: 35, image: '🍝' },
        { id: 8, name: 'Queso', price: 45.00, category: 'Lácteos', barcode: '7501055901012', stock: 25, image: '🧀' },
        { id: 9, name: 'Yogurt', price: 18.90, category: 'Lácteos', barcode: '7501055902095', stock: 40, image: '🥛' },
        { id: 10, name: 'Refresco', price: 17.50, category: 'Bebidas', barcode: '7501055363513', stock: 60, image: '🥤' }
      ];
      
      // Filtrado de productos mock (si hay filtros)
      let filteredProducts = [...mockProducts];
      
      if (filters.category && filters.category !== 'Todos') {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) || 
          p.barcode.includes(searchTerm)
        );
      }
      
      return filteredProducts;
   
      // const response = await api.get('/products', { params: filters });
      // return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },
  
  // Buscar producto por código de barras
  getProductByBarcode: async (barcode) => {
    try {
      // Versión Mock
      const mockProducts = await productService.getAllProducts();
      return mockProducts.find(p => p.barcode === barcode) || null;
      
      
      // const response = await api.get(`/products/barcode/${barcode}`);
      // return response.data;
    } catch (error) {
      console.error('Error al buscar producto por código de barras:', error);
      throw error;
    }
  },
  
  // Buscar producto por ID
  getProductById: async (id) => {
    try {
      // Versión Mock
      const mockProducts = await productService.getAllProducts();
      return mockProducts.find(p => p.id === id) || null;
      
      
      // const response = await api.get(`/products/${id}`);
      // return response.data;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  }
};

export default productService;