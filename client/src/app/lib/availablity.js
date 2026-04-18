import api from './api';

export const availabilityAPI = {
  getSlots: async (date) => {
    const res = await api.get(`/availability/slots?date=${date}`);
    return res.data;
  },
  setAvailability: async (data) => {
    const res = await api.post('/availability/admin/set', data);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/availability/admin/all');
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/availability/admin/${id}`);
    return res.data;
  },
  getAvailableDates: async () => {
  const res = await api.get('/availability/available-dates');
  return res.data;
}
};