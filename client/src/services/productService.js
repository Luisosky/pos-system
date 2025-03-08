// Api calls for products
import api from './api';

const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export default productService;