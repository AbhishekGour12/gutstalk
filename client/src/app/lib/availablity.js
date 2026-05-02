import api from './api';

export const availabilityAPI = {
  generateSlots: async (data) => {
    const res = await api.post('/availability/generate', data);
    return res.data;
  },
  getSlots: async (date, userId) => {
    const query = `?date=${date}${userId ? `&userId=${userId}` : ''}`;
    const res = await api.get(`/availability/slots${query}`);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/availability/admin/all');
    return res.data;
  },
  deleteSlot: async (id) => {
    const res = await api.delete(`/availability/admin/slot/${id}`);
    return res.data;
  },
  holdSlot: async (data) => {
    const res = await api.post('/availability/hold-slot', data);
    return res.data;
  },
  releaseSlot: async (data) => {
    const res = await api.post('/availability/release-slot', data);
    return res.data;
  },
  getAvailableDates: async () => {
    const res = await api.get('/availability/available-dates');
    return res.data;
  }
};