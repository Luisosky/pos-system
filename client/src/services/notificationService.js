import { api } from './api';

const notificationService = {
  getNotifications: async () => {
    // Datos de ejemplo para desarrollo
    return [
      { id: 1, type: 'success', message: 'Actualización de inventario completada' },
      { id: 2, type: 'warning', message: 'Stock bajo de "Leche" (5 unidades)' },
    ];
    

    // const response = await api.get('/notifications');
    // return response.data;
  }
};

export default notificationService;