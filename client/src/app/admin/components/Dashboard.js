import { FaRupeeSign, FaShoppingBag, FaUsers, FaBoxes, FaClock } from "react-icons/fa";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard({ stats }) {
  const cards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FaRupeeSign, change: "+12%", trend: "up" },
    { title: "Total Orders", value: stats.totalOrders, icon: FaShoppingBag, change: "+5%", trend: "up" },
    { title: "Total Customers", value: stats.totalCustomers, icon: FaUsers, change: "+8%", trend: "up" },
    { title: "Total Products", value: stats.totalProducts, icon: FaBoxes, change: "+2", trend: "up" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: FaClock, change: "-3", trend: "down" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1A4D3E]">Dashboard</h1>
        <span className="text-sm text-[#8A9B6E]">Last 30 days</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
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
      {/* You can add recent orders chart here */}
    </div>
  );
}