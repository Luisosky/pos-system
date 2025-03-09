import { api } from './api';

const orderService = {
  createOrder: async (orderData) => {
    // Versión para desarrollo (simula una llamada API)
    console.log("Creando orden:", orderData);
    return {
      id: "order-" + Math.random().toString(36).substr(2, 9),
      ...orderData,
      createdAt: new Date().toISOString()
    };
    
    
    // const response = await api.post('/orders', orderData);
    // return response.data;
  },
  
  getDailySummary: async () => {
    // Datos de ejemplo para desarrollo
    return {
      totalSales: 1250.75,
      orderCount: 15,
      frequentCustomerPercentage: 30
    };
    
 
    // const response = await api.get('/orders/summary/daily');
    // return response.data;
  }
};

export default orderService;