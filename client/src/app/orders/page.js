"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTruck, FaChevronDown, FaChevronUp, FaBox, FaMapMarkerAlt, FaMoneyBill } from "react-icons/fa";
import { orderAPI } from "../lib/order";
import toast from "react-hot-toast";
import OrderTracking from "../components/OrderTracking";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [trackId, setTrackId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const normalizeStatus = (status = "") =>
    status.toLowerCase().replace(/_/g, " ").trim();

  const loadOrders = async () => {
    try {
      const data = await orderAPI.getUserOrders();
      console.log(data);
      setOrders(data.orders);
    } catch (e) {
      toast.error("No orders found");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user && !token) {
      toast.error("Please login to view your orders");
      router.push("/Login");
      return;
    }
    loadOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isCanceledOrder = (status = "") => {
    return normalizeStatus(status) === "canceled";
  };

  const getStatusStyle = (status) => {
    const s = normalizeStatus(status);

    if (s === "delivered")
      return "bg-green-100 text-green-700";
    if (s === "out for delivery")
      return "bg-orange-100 text-orange-700";
    if (["in transit", "reached at hub"].includes(s))
      return "bg-blue-100 text-blue-700";
    if (["picked up", "out for pickup", "pickup generated", "pickup completed"].includes(s))
      return "bg-purple-100 text-purple-700";
    if (s === "canceled")
      return "bg-red-100 text-red-700";
    if (s.includes("rto"))
      return "bg-rose-100 text-rose-700";
    return "bg-[#E8F4F7] text-[#18606D]";
  };

  const getProgressStep = (status = "") => {
    const s = normalizeStatus(status);
    if (s === "order placed") return 0;
    if (s === "pickup scheduled") return 1;
    if (s === "picked up") return 2;
    if (s === "in transit") return 3;
    if (s === "out for delivery") return 4;
    if (s === "delivered") return 5;
    if (s === "undelivered") return 6;
    if (s === "pickup generated") return 1;
    if (s === "pickup completed") return 2;
    if (s.includes("rto")) return 7;
    return 0;
  };

  const mapStatusForUser = (status = "") => {
    const s = normalizeStatus(status);
    if (["order placed", "processing"].includes(s)) return "Order Placed";
    if (["pickup scheduled"].includes(s)) return "Pickup Scheduled";
    if (["out for pickup", "picked up", "pickup completed"].includes(s)) return "Picked Up";
    if (["shipped", "in transit", "reached at hub", "departed hub"].includes(s)) return "In Transit";
    if (["out for delivery"].includes(s)) return "Out for Delivery";
    if (["delivered"].includes(s)) return "Delivered";
    if (["undelivered"].includes(s)) return "In Transit";
    if (["pickup generated"].includes(s)) return "Pickup scheduled";
    if (s === "canceled") return "Canceled";
    if (s.includes("rto")) return "Returned";
    return "Processing";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAFB] via-white to-[#E8F4F7] p-6">
      <div className="max-w-4xl mx-auto mt-32">
        <h2 className="text-3xl font-bold text-[#1A4D3E] mb-8">My Orders</h2>

        {orders.length === 0 && (
          <p className="text-center text-[#64748B] mt-10">You have no orders yet.</p>
        )}

        {trackId && (
          <OrderTracking shipmentId={trackId} onClose={() => setTrackId(null)} />
        )}

        <div className="space-y-6">
          {[...orders]
            .sort((a, b) => {
              const aCanceled = isCanceledOrder(a.shiprocketStatus);
              const bCanceled = isCanceledOrder(b.shiprocketStatus);
              if (aCanceled && !bCanceled) return 1;
              if (!aCanceled && bCanceled) return -1;
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border border-[#D9EEF2] p-6 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-[#1A4D3E] text-lg">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-[#64748B]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-semibold ${getStatusStyle(
                      mapStatusForUser(order.shiprocketStatus)
                    )}`}
                  >
                    {mapStatusForUser(order.shiprocketStatus)}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-5 space-y-3">
                  {order.items.map((i, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-[#F4FAFB] p-4 rounded-xl border border-[#D9EEF2]"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API}${i?.image}`}
                        className="w-16 h-16 rounded-lg object-cover border border-[#D9EEF2]"
                        alt={i.product?.name}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[#1A4D3E]">{i.name}</p>
                        <p className="text-sm text-[#64748B]">Qty: {i.quantity}</p>
                      </div>
                      <p className="font-bold text-[#18606D]">₹{i.priceAtPurchase}</p>
                    </div>
                  ))}
                </div>

                {/* Total + Track */}
                <div className="flex justify-between items-center mt-5 flex-wrap gap-3">
                  <p className="font-bold text-xl text-[#18606D]">Total: ₹{order.totalAmount}</p>
                  {order.shiprocketOrderId ? (
                    <button
                      onClick={() => setTrackId(order.shiprocketOrderId)}
                      className="px-4 py-2 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white rounded-xl flex items-center gap-2 shadow hover:shadow-lg transition"
                    >
                      <FaTruck /> Track Order
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-200 text-gray-500 rounded-xl flex items-center gap-2 cursor-not-allowed"
                    >
                      <FaTruck /> Creating Shipment...
                    </button>
                  )}
                </div>

                {/* Expand button */}
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="mt-4 flex items-center gap-2 text-[#18606D] font-semibold hover:text-[#2A7F8F] transition"
                >
                  {expanded[order._id] ? <FaChevronUp /> : <FaChevronDown />}
                  {expanded[order._id] ? "Hide Details" : "View Details"}
                </button>

                {/* Expanded area */}
                {expanded[order._id] && (
                  <div className="mt-5 border-t border-[#D9EEF2] pt-4 space-y-4">
                    {isCanceledOrder(order.shiprocketStatus) && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700">
                        <p className="font-semibold">Order Canceled</p>
                        <p>For refund related queries, please contact us.</p>
                      </div>
                    )}

                    {/* Shipping Address */}
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-[#18606D] mt-1" />
                      <div>
                        <p className="text-[#1A4D3E] font-semibold">Delivery Address</p>
                        <p className="text-[#64748B] text-sm">
                          {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{" "}
                          {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-3">
                      <FaMoneyBill className="text-[#18606D]" />
                      <p className="text-[#1A4D3E]">
                        Payment: <span className="font-semibold">{order.paymentMethod.toUpperCase()}</span>
                      </p>
                    </div>

                    {/* Shipment Info */}
                    {order.shiprocketOrderId && (
                      <div className="bg-[#F4FAFB] p-4 rounded-xl border border-[#D9EEF2]">
                        <p className="font-semibold text-[#1A4D3E]">Shipment Info</p>
                        <p className="text-sm text-[#64748B]">Order ID: {order.shiprocketOrderId}</p>
                        <p className="text-sm text-[#64748B]">Shipment ID: {order.shiprocketShipmentId}</p>
                        <p className="text-sm text-[#64748B]">
                          AWB: <span className="font-semibold text-[#18606D]">{order.awbCode || "Assigning..."}</span>
                        </p>
                      </div>
                    )}

                    {/* Order Progress Timeline */}
                    <div className="mt-3">
                      <p className="font-semibold text-[#1A4D3E] mb-3">Order Progress</p>
                      <div className="flex items-center justify-between">
                        {[
                          "Order Placed",
                          "Pickup Scheduled",
                          "Picked Up",
                          "In Transit",
                          "Out for Delivery",
                          "Delivered"
                        ].map((step, index) => {
                          const isActive = index <= getProgressStep(mapStatusForUser(order.shiprocketStatus));
                          return (
                            <div key={index} className="flex flex-col items-center w-full">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                                ${isActive ? "bg-gradient-to-r from-[#18606D] to-[#2A7F8F]" : "bg-gray-300"}`}
                              >
                                {index + 1}
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;