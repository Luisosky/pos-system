// Api calls for orders
import api from './api';

const orderService = {
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getDailySummary: async () => {
    const response = await api.get('/orders/daily-summary');
    return response.data;
  },

  getCashierOrders: async (cashierId) => {
    const response = await api.get(`/orders/cashier/${cashierId}`);
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  updateOrder: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
  
  closeCashRegister: async (closingData) => {
    const response = await api.post('/orders/close-register', closingData);
    return response.data;
  }

};

export default orderService;