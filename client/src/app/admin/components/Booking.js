"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaVideo, FaSearch, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { bookingAPI } from "../../lib/booking";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingAPI.getAllBookings(); // you need to add this API endpoint
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus}`);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestPhone?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A4D3E]">Consultation Bookings</h1>
          <p className="text-sm text-[#64748B]">Manage all scheduled calls</p>
        </div>
        <div className="bg-[#18606D]/10 px-4 py-2 rounded-full">
          <span className="font-semibold text-[#18606D]">Total: {bookings.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-[#D9EEF2] mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by booking ID, name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#D9EEF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18606D]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#D9EEF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18606D]"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-md border border-[#D9EEF2] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18606D]"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-4xl text-[#64748B] mx-auto mb-3" />
            <p className="text-[#1A4D3E]">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F4FAFB] border-b border-[#D9EEF2]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A4D3E]">Booking ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A4D3E]">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A4D3E]">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A4D3E]">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A4D3E]">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A4D3E]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F4F7]">
                {filteredBookings.map((booking) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#F4FAFB] transition"
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-[#1A4D3E]">{booking.bookingId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#1A4D3E]">{booking.guestName || "Guest"}</p>
                        <p className="text-xs text-[#64748B]">{booking.guestPhone || booking.guestEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#18606D] text-xs" />
                        <span className="text-sm">{format(new Date(booking.date), "dd MMM yyyy")}</span>
                        <FaClock className="text-[#18606D] text-xs ml-2" />
                        <span className="text-sm">{booking.startTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#18606D]">₹{booking.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-[#18606D] hover:bg-[#E8F4F7] rounded-lg"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {booking.meetLink && (
                          <a
                            href={booking.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Join Meeting"
                          >
                            <FaVideo />
                          </a>
                        )}
                        {booking.status === "scheduled" && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "completed")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Mark Completed"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, "cancelled")}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Cancel Booking"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white p-5 border-b border-[#D9EEF2] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1A4D3E]">Booking Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-[#F4FAFB] rounded-lg">
                <FaTimesCircle />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#64748B]">Booking ID</p>
                  <p className="font-mono text-[#1A4D3E]">{selectedBooking.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748B]">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Customer</p>
                <p className="font-medium text-[#1A4D3E]">{selectedBooking.guestName || "N/A"}</p>
                <p className="text-sm">{selectedBooking.guestEmail || "N/A"}</p>
                <p className="text-sm">{selectedBooking.guestPhone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Schedule</p>
                <p>{format(new Date(selectedBooking.date), "dd MMM yyyy")} at {selectedBooking.startTime} - {selectedBooking.endTime} IST</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Payment</p>
                <p className="font-semibold text-[#18606D]">₹{selectedBooking.price}</p>
                <p className="text-xs text-green-600">Status: {selectedBooking.paymentStatus}</p>
              </div>
              {selectedBooking.meetLink && (
                <div>
                  <p className="text-sm text-[#64748B]">Meeting Link</p>
                  <a href={selectedBooking.meetLink} target="_blank" className="text-[#18606D] underline break-all">
                    {selectedBooking.meetLink}
                  </a>
                </div>
              )}
              {selectedBooking.mcqAnswers?.length > 0 && (
                <div>
                  <p className="text-sm text-[#64748B]">Questionnaire Answers</p>
                  <div className="bg-[#F4FAFB] p-3 rounded-xl max-h-48 overflow-y-auto">
                    {selectedBooking.mcqAnswers.map((ans, idx) => (
                      <div key={idx} className="mb-2 pb-2 border-b border-[#D9EEF2] last:border-0">
                        <p className="text-xs font-medium text-[#1A4D3E]">Q{idx + 1}</p>
                        <p className="text-sm">{ans.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}