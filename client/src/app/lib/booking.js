import api from './api';

export const bookingAPI = {
  getMyBookings: async () => {
    const res = await api.get('/booking/my-bookings');
    return res.data;
  },
  initiateBooking: async (data) => {
    const res = await api.post('/booking/initiate', data);
    return res.data;
  },
  updateBooking: async (bookingId, userData) => {
    const res = await api.put(`/booking/update/${bookingId}`, userData);
    return res.data;
  },
  submitMCQs: async (bookingId, answers) => {
    const res = await api.post('/booking/submit-mcq', { bookingId, answers });
    return res.data;
  },
  getMCQs: async () => {
    const res = await api.get('/booking/mcqs');
    return res.data;
  },
  getAllBookings: async () => {
    const res = await api.get('/booking/admin/all');
    return res.data;
  },
  updateBookingStatus: async (bookingId, status) => {
    const res = await api.put(`/booking/admin/${bookingId}/status`, { status });
    return res.data;
  }

  
};