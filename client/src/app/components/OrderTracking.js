"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTruck, FaMapMarkerAlt, FaClock, FaTimes } from "react-icons/fa";
import { orderAPI } from "../lib/order";
import toast from "react-hot-toast";

const statusColor = {
  Delivered: "text-green-700",
  "Out for Delivery": "text-orange-600",
  "In Transit": "text-blue-600",
  Processing: "text-[#18606D]",
  Canceled: "text-red-600",
  Returned: "text-rose-600",
};

const OrderTracking = ({ shipmentId, onClose }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTracking = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.trackOrder(shipmentId);
      setTracking(data);
    } catch {
      toast.error("Failed to load tracking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shipmentId) loadTracking();
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]">
        <div className="bg-white px-6 py-4 rounded-xl shadow-lg text-[#18606D] font-medium border border-[#D9EEF2]">
          Fetching tracking…
        </div>
      </div>
    );
  }

  if (!tracking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[99999]"
    >
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl border border-[#D9EEF2]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-[#1A4D3E] flex items-center gap-2">
            <FaTruck className="text-[#18606D]" /> Order Tracking
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl font-bold transition">
            <FaTimes />
          </button>
        </div>

        {/* SUMMARY */}
        <div className="bg-[#F4FAFB] p-4 rounded-xl mb-4 border border-[#D9EEF2]">
          <p className="font-semibold text-[#1A4D3E]">
            Courier: <span className="font-normal text-[#64748B]">{tracking.courier}</span>
          </p>
          <p className="text-sm text-[#64748B]">AWB: {tracking.awb}</p>
          <p className={`font-bold mt-2 ${statusColor[tracking.current_status] || "text-[#18606D]"}`}>
            Status: {tracking.current_status}
          </p>
          {tracking.etd && (
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
              <FaClock className="text-[#18606D]" /> Expected by {new Date(tracking.etd).toDateString()}
            </p>
          )}
        </div>

        {/* TIMELINE */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {tracking.tracking_data?.shipment_track_activities?.map((event, idx) => (
            <div key={idx} className="flex gap-3">
              <FaMapMarkerAlt className="text-[#18606D] mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#1A4D3E]">{event.activity}</p>
                <p className="text-xs text-[#64748B]">{event.location || "-"}</p>
                <p className="text-xs text-[#64748B]">{new Date(event.date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TRACK LINK */}
        {tracking.track_url && (
          <a
            href={tracking.track_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-center text-[#18606D] font-semibold underline hover:text-[#2A7F8F] transition"
          >
            Track on Courier Website
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default OrderTracking;