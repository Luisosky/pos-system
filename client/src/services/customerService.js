import api from './api';

const customerService = {
  getAllCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  
  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },
  
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },
  
  searchCustomers: async (searchTerm) => {
    const response = await api.get(`/customers/search?term=${searchTerm}`);
    return response.data;
  }
};

export default customerService;