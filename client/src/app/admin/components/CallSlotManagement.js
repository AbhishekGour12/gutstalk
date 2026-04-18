"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash, FaSave, FaSpinner } from 'react-icons/fa';
import { availabilityAPI } from '../../lib/availablity';
import toast from 'react-hot-toast';

export default function CallSlotManagement() {
  const [availabilities, setAvailabilities] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '18:00',
    endTime: '21:00',
    slotDuration: 45,
    breakBetweenSlots: 5
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchAvailabilities = async () => {
    try {
      const res = await availabilityAPI.getAll();
      setAvailabilities(res.availabilities || []);
    } catch (error) {
      toast.error('Failed to fetch slots');
    }
  };

  useEffect(() => { fetchAvailabilities(); }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlot.date) return toast.error('Please select a date');
    setLoading(true);
    try {
      await availabilityAPI.setAvailability(newSlot);
      toast.success('Slot added successfully');
      fetchAvailabilities();
      setNewSlot({ ...newSlot, date: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this availability?')) return;
    setDeleteLoading(id);
    try {
      await availabilityAPI.delete(id);
      toast.success('Slot deleted');
      fetchAvailabilities();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A4D3E]">Call Availability Management</h1>
        <p className="text-[#64748B] mt-1">Set your available time slots for consultations</p>
      </div>

      {/* Add New Slot Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#D9EEF2] overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaPlus /> Add New Availability
          </h2>
        </div>
        <form onSubmit={handleAddSlot} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Date *</label>
              <input 
                type="date" 
                required 
                value={newSlot.date} 
                onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Start Time</label>
              <input 
                type="time" 
                value={newSlot.startTime} 
                onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A4D3E] mb-1">End Time</label>
              <input 
                type="time" 
                value={newSlot.endTime} 
                onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Slot Duration (min)</label>
              <input 
                type="number" 
                value={newSlot.slotDuration} 
                onChange={e => setNewSlot({...newSlot, slotDuration: parseInt(e.target.value)})}
                className="w-full px-4 py-2.5 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {loading ? 'Adding...' : 'Add Slot'}
              </button>
            </div>
          </div>
        </form>
      </div>
      

      {/* Existing Slots */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#D9EEF2] overflow-hidden">
        <div className="bg-gradient-to-r from-[#F4FAFB] to-white px-6 py-4 border-b border-[#D9EEF2]">
          <h2 className="text-lg font-semibold text-[#1A4D3E] flex items-center gap-2">
            <FaCalendarAlt /> Existing Slots
          </h2>
        </div>
        <div className="divide-y divide-[#E8F4F7]">
          {availabilities.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="text-4xl text-[#64748B] mx-auto mb-3" />
              <p className="text-[#64748B]">No availability slots added yet.</p>
            </div>
          ) : (
            availabilities.map(slot => (
              <motion.div
                key={slot._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-4 hover:bg-[#F4FAFB] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8F4F7] flex items-center justify-center">
                    <FaCalendarAlt className="text-[#18606D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A4D3E]">{new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-[#64748B]">
                      <FaClock className="inline mr-1 text-xs" /> {slot.startTime} – {slot.endTime} 
                      <span className="mx-2">•</span>
                      {slot.slotDuration} min slots
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(slot._id)} 
                  disabled={deleteLoading === slot._id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleteLoading === slot._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}