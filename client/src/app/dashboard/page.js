"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTruck, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaMoneyBill, 
  FaCalendarAlt, FaClock, FaVideo, FaFileAlt, FaBox 
} from "react-icons/fa";
import { orderAPI } from "../lib/order";
import { bookingAPI } from "../lib/booking";
import toast from "react-hot-toast";
import OrderTracking from "../components/OrderTracking";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "consultations"
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [trackId, setTrackId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState({});
  const [expandedBooking, setExpandedBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  // Helper: normalize status
  const normalizeStatus = (status = "") => status.toLowerCase().replace(/_/g, " ").trim();

  // Load Orders
  const loadOrders = async () => {
    try {
      const data = await orderAPI.getUserOrders();
      console.log("Fetched Orders:", data.orders);
      setOrders(data.orders || []);
    } catch (e) {
      console.error("Error loading orders:", e);
    }
  };

  // Load Consultation Bookings
  const loadBookings = async () => {
    try {
      const data = await bookingAPI.getMyBookings();
      console.log("Fetched Bookings:", data.bookings);
      setBookings(data.bookings || []);
    } catch (e) {
      console.error("Error loading bookings:", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user && !token) {
      toast.error("Please login to view your dashboard");
      router.push("/Login");
      return;
    }
    Promise.all([loadOrders(), loadBookings()]).finally(() => setLoading(false));
  }, []);

  const toggleOrderExpand = (id) => {
    setExpandedOrder((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookingExpand = (id) => {
    setExpandedBooking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Status styles for orders
  const getOrderStatusStyle = (status) => {
    const s = normalizeStatus(status);
    if (s === "delivered") return "bg-green-100 text-green-700";
    if (s === "out for delivery") return "bg-orange-100 text-orange-700";
    if (["in transit", "reached at hub"].includes(s)) return "bg-blue-100 text-blue-700";
    if (["picked up", "out for pickup", "pickup generated", "pickup completed"].includes(s)) return "bg-purple-100 text-purple-700";
    if (s === "canceled") return "bg-red-100 text-red-700";
    if (s.includes("rto")) return "bg-rose-100 text-rose-700";
    return "bg-[#E8F4F7] text-[#18606D]";
  };

  const getOrderProgressStep = (status) => {
    const s = normalizeStatus(status);
    if (s === "order placed") return 0;
    if (s === "pickup scheduled") return 1;
    if (s === "picked up") return 2;
    if (s === "in transit") return 3;
    if (s === "out for delivery") return 4;
    if (s === "delivered") return 5;
    return 0;
  };

  const mapOrderStatusForUser = (status) => {
    const s = normalizeStatus(status);
    if (["order placed", "processing"].includes(s)) return "Order Placed";
    if (["pickup scheduled", "pickup generated"].includes(s)) return "Pickup Scheduled";
    if (["out for pickup", "picked up", "pickup completed"].includes(s)) return "Picked Up";
    if (["shipped", "in transit", "reached at hub", "departed hub"].includes(s)) return "In Transit";
    if (["out for delivery"].includes(s)) return "Out for Delivery";
    if (["delivered"].includes(s)) return "Delivered";
    if (s === "canceled") return "Canceled";
    if (s.includes("rto")) return "Returned";
    return "Processing";
  };

  // Booking status styles
  const getBookingStatusStyle = (status) => {
    if (status === "scheduled") return "bg-green-100 text-green-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18606D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAFB] via-white to-[#E8F4F7] p-6">
      <div className="max-w-6xl mx-auto mt-24">
        <h1 className="text-3xl font-bold text-[#1A4D3E] mb-2">My Dashboard</h1>
        <p className="text-[#64748B] mb-6">Manage your orders and consultation bookings</p>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#D9EEF2] mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === "orders"
                ? "text-[#18606D] border-b-2 border-[#18606D]"
                : "text-[#64748B] hover:text-[#18606D]"
            }`}
          >
            <FaBox className="inline mr-2" /> Product Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("consultations")}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === "consultations"
                ? "text-[#18606D] border-b-2 border-[#18606D]"
                : "text-[#64748B] hover:text-[#18606D]"
            }`}
          >
            <FaCalendarAlt className="inline mr-2" /> Consultation Bookings ({bookings.length})
          </button>
        </div>

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#D9EEF2]">
                <FaBox className="text-4xl text-[#64748B] mx-auto mb-3" />
                <p className="text-[#1A4D3E]">No orders yet</p>
                <button
                  onClick={() => router.push("/products")}
                  className="mt-3 text-[#18606D] underline"
                >
                  Browse Products →
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-md border border-[#D9EEF2] p-6"
                >
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <p className="font-semibold text-[#1A4D3E] text-lg">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-sm text-[#64748B]">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${getOrderStatusStyle(order.shiprocketStatus)}`}>
                      {mapOrderStatusForUser(order.shiprocketStatus)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mt-4 space-y-2">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-[#F4FAFB] p-3 rounded-xl">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API}${i.image}`}
                          className="w-12 h-12 rounded-lg object-cover border border-[#D9EEF2]"
                          alt={i.product?.name}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-[#1A4D3E]">{i.product?.name}</p>
                          <p className="text-sm text-[#64748B]">Qty: {i.quantity}</p>
                        </div>
                        <p className="font-bold text-[#18606D]">₹{i.priceAtPurchase}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total + Track */}
                  <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
                    <p className="font-bold text-xl text-[#18606D]">Total: ₹{order.totalAmount}</p>
                    {order.shiprocketOrderId ? (
                      <button
                        onClick={() => setTrackId(order.shiprocketOrderId)}
                        className="px-4 py-2 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white rounded-xl flex items-center gap-2 shadow hover:shadow-lg transition"
                      >
                        <FaTruck /> Track Order
                      </button>
                    ) : (
                      <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed">
                        <FaTruck /> Creating Shipment...
                      </button>
                    )}
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => toggleOrderExpand(order._id)}
                    className="mt-4 flex items-center gap-2 text-[#18606D] font-semibold hover:text-[#2A7F8F] transition"
                  >
                    {expandedOrder[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                    {expandedOrder[order._id] ? "Hide Details" : "View Details"}
                  </button>

                  {/* Expanded details */}
                  {expandedOrder[order._id] && (
                    <div className="mt-4 pt-4 border-t border-[#D9EEF2] space-y-3">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-[#18606D] mt-1" />
                        <div>
                          <p className="font-semibold text-[#1A4D3E]">Delivery Address</p>
                          <p className="text-sm text-[#64748B]">
                            {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{" "}
                            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMoneyBill className="text-[#18606D]" />
                        <p className="text-[#1A4D3E]">Payment: <span className="font-semibold">{order.paymentMethod.toUpperCase()}</span></p>
                      </div>
                      {order.shiprocketOrderId && (
                        <div className="bg-[#F4FAFB] p-3 rounded-xl">
                          <p className="font-semibold text-[#1A4D3E]">Shipment Info</p>
                          <p className="text-sm">AWB: {order.awbCode || "Assigning..."}</p>
                        </div>
                      )}
                      {/* Order Progress */}
                      <div>
                        <p className="font-semibold text-[#1A4D3E] mb-2">Order Progress</p>
                        <div className="flex justify-between">
                          {["Order Placed", "Pickup Scheduled", "Picked Up", "In Transit", "Out for Delivery", "Delivered"].map((step, idx) => {
                            const isActive = idx <= getOrderProgressStep(order.shiprocketStatus);
                            return (
                              <div key={idx} className="flex flex-col items-center w-full">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isActive ? "bg-gradient-to-r from-[#18606D] to-[#2A7F8F]" : "bg-gray-300"}`}>
                                  {idx + 1}
                                </div>
                                <p className="text-xs mt-1 text-center text-[#64748B]">{step}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Consultations Section */}
        {activeTab === "consultations" && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#D9EEF2]">
                <FaCalendarAlt className="text-4xl text-[#64748B] mx-auto mb-3" />
                <p className="text-[#1A4D3E]">No consultation bookings yet</p>
                <button
                  onClick={() => router.push("/products")}
                  className="mt-3 text-[#18606D] underline"
                >
                  Book a Consultation →
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-md border border-[#D9EEF2] p-6"
                >
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <p className="font-semibold text-[#1A4D3E] text-lg">
                        Booking #{booking.bookingId.slice(-8)}
                      </p>
                      <p className="text-sm text-[#64748B]">
                        {format(new Date(booking.date), "dd MMM yyyy")} at {booking.startTime}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${getBookingStatusStyle(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[#1A4D3E]">
                      <FaClock className="text-[#18606D]" />
                      <span>{booking.startTime} – {booking.endTime} (IST)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1A4D3E]">
                      <FaMoneyBill className="text-[#18606D]" />
                      <span>Paid: ₹{booking.price}</span>
                    </div>
                  </div>

                  {/* Meeting Link if available */}
                  {booking.meetLink && (
                    <div className="mt-3 flex items-center gap-2">
                      <FaVideo className="text-[#18606D]" />
                      <a
                        href={booking.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#18606D] underline hover:text-[#2A7F8F]"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}

                  {/* Expand button */}
                  <button
                    onClick={() => toggleBookingExpand(booking._id)}
                    className="mt-4 flex items-center gap-2 text-[#18606D] font-semibold hover:text-[#2A7F8F] transition"
                  >
                    {expandedBooking[booking._id] ? <FaChevronUp /> : <FaChevronDown />}
                    {expandedBooking[booking._id] ? "Hide Details" : "View Details"}
                  </button>

                  {/* Expanded details */}
                  {expandedBooking[booking._id] && (
                    <div className="mt-4 pt-4 border-t border-[#D9EEF2] space-y-3">
                      <div className="flex items-start gap-3">
                        <FaFileAlt className="text-[#18606D] mt-1" />
                        <div>
                          <p className="font-semibold text-[#1A4D3E]">Booking Information</p>
                          <p className="text-sm text-[#64748B]">Booking ID: {booking.bookingId}</p>
                          <p className="text-sm text-[#64748B]">Created: {new Date(booking.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      {booking.mcqAnswers?.length > 0 && (
                        <div className="bg-[#F4FAFB] p-3 rounded-xl">
                          <p className="font-semibold text-[#1A4D3E]">Questionnaire Responses</p>
                          <p className="text-sm text-[#64748B]">{booking.mcqAnswers.length} questions answered</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {trackId && <OrderTracking shipmentId={trackId} onClose={() => setTrackId(null)} />}
    </div>
  );
};

export default Dashboard;