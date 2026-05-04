"use client";
import { useState, useEffect } from 'react';
import { 
  FaRupeeSign, FaShoppingBag, FaUsers, FaBoxes, FaClock, 
  FaCalendarCheck, FaChartLine, FaChartPie 
} from 'react-icons/fa';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

import toast from 'react-hot-toast';
import ProductApi from '../../lib/ProductApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalConsultations: 0,
    consultationRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    pendingConsultations: 0,
    lowStockProducts: 0,
    conversionRate: 0
  });
  const [charts, setCharts] = useState({
    monthlyRevenue: [],
    consultationTrends: [],
    orderStatusCounts: {}
  });
  const [recent, setRecent] = useState({ orders: [], consultations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await ProductApi.getDashboardStats();
      setStats(data.stats);
      setCharts(data.charts);
      setRecent(data.recent);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FaRupeeSign, change: "+12%", trend: "up" },
    { title: "Total Orders", value: stats.totalOrders, icon: FaShoppingBag, change: "+5%", trend: "up" },
    { title: "Consultations", value: stats.totalConsultations, icon: FaCalendarCheck, change: "+8%", trend: "up" },
    { title: "Total Customers", value: stats.totalCustomers, icon: FaUsers, change: "+8%", trend: "up" },
    { title: "Total Products", value: stats.totalProducts, icon: FaBoxes, change: "+2", trend: "up" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: FaClock, change: "-3", trend: "down" },
    { title: "Pending Consults", value: stats.pendingConsultations, icon: FaCalendarCheck, change: "-1", trend: "down" },
    { title: "Conversion Rate", value: `${stats.conversionRate}%`, icon: FaChartLine, change: "+2%", trend: "up" },
  ];

  const COLORS = ['#18606D', '#2A7F8F', '#E67E22', '#E74C3C', '#95A5A6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18606D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1A4D3E]">Dashboard</h1>
        <span className="text-sm text-[#64748B]">Last 30 days</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-md border border-[#D9EEF2] hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#64748B]">{card.title}</p>
                <p className="text-2xl font-bold text-[#1A4D3E] mt-1">{card.value}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#E8F4F7] flex items-center justify-center text-[#18606D]">
                <card.icon size={20} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs">
              {card.trend === "up" ? (
                <TrendingUp size={12} className="text-green-600" />
              ) : (
                <TrendingDown size={12} className="text-red-500" />
              )}
              <span className={card.trend === "up" ? "text-green-600" : "text-red-500"}>{card.change}</span>
              <span className="text-[#64748B]">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#D9EEF2]">
          <h3 className="font-semibold text-[#1A4D3E] mb-4 flex items-center gap-2">
            <FaChartLine className="text-[#18606D]" /> Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#18606D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Consultation Trends */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#D9EEF2]">
          <h3 className="font-semibold text-[#1A4D3E] mb-4 flex items-center gap-2">
            <FaCalendarCheck className="text-[#18606D]" /> Consultation Bookings
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.consultationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2A7F8F" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-[#D9EEF2]">
        <h3 className="font-semibold text-[#1A4D3E] mb-4 flex items-center gap-2">
          <FaChartPie className="text-[#18606D]" /> Order Status Distribution
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(charts.orderStatusCounts).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {Object.entries(charts.orderStatusCounts).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {Object.entries(charts.orderStatusCounts).map(([name, value], idx) => (
              <div key={name} className="flex justify-between items-center border-b border-[#D9EEF2] py-2">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="capitalize">{name}</span>
                </span>
                <span className="font-semibold text-[#1A4D3E]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#D9EEF2]">
          <h3 className="font-semibold text-[#1A4D3E] mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recent.orders.map(order => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-[#F4FAFB] rounded-xl">
                <div>
                  <p className="font-medium text-sm">#{order._id.slice(-6)}</p>
                  <p className="text-xs text-[#64748B]">{order.userId?.name || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#18606D]">₹{order.totalAmount}</p>
                  <p className="text-xs text-[#64748B]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recent.orders.length === 0 && <p className="text-center text-[#64748B]">No orders yet.</p>}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#D9EEF2]">
          <h3 className="font-semibold text-[#1A4D3E] mb-4">Recent Consultations</h3>
          <div className="space-y-3">
            {recent.consultations.map(consult => (
              <div key={consult._id} className="flex justify-between items-center p-3 bg-[#F4FAFB] rounded-xl">
                <div>
                  <p className="font-medium text-sm">{consult.bookingId}</p>
                  <p className="text-xs text-[#64748B]">{consult.guestName || consult.userId?.name || 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#18606D]">₹{consult.price}</p>
                  <p className="text-xs text-[#64748B]">{new Date(consult.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recent.consultations.length === 0 && <p className="text-center text-[#64748B]">No consultations yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}