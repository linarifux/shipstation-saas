import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { ShoppingBag, User, Mail, Calendar, DollarSign, Package } from "lucide-react";

export default function ShopifyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shopify/orders`);
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error loading orders", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      ""
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] md:min-h-[70vh]">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    // Responsive Padding: p-4 on mobile, p-6 on desktop
    <div className="p-4 md:p-6 text-slate-100 max-w-full pb-20">
      
      {/* HEADER: Stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="text-cyan-400" /> Shopify Orders
        </h1>

        <button
          onClick={fetchOrders}
          className="w-full sm:w-auto bg-cyan-600 px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium shadow-lg shadow-cyan-900/20"
        >
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by order # or customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
      />

      {/* 🖥️ DESKTOP VIEW: Table */}
      <div className="hidden md:block overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-center">Items</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 font-bold text-cyan-400">{order.name}</td>
                <td className="p-4 font-medium">
                  {order.customer
                    ? `${order.customer.first_name} ${order.customer.last_name}`
                    : "Guest"}
                </td>
                <td className="p-4 text-slate-400">{order.email || "-"}</td>
                <td className="p-4 font-mono text-emerald-400">${order.total_price}</td>
                <td className="p-4 text-center">
                  <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs">
                    {order.line_items?.length}
                  </span>
                </td>
                <td className="p-4">
                  <PaymentBadge status={order.financial_status} />
                </td>
                <td className="p-4 text-slate-400">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE VIEW: Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.map((order) => (
          <div 
            key={order.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-cyan-400">{order.name}</h3>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <PaymentBadge status={order.financial_status} />
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300">
              
              <div className="col-span-2 flex items-center gap-2 text-slate-200 font-medium">
                <User size={16} className="text-slate-500" />
                {order.customer
                    ? `${order.customer.first_name} ${order.customer.last_name}`
                    : "Guest"}
              </div>

              <div className="col-span-2 flex items-center gap-2 text-slate-400 text-xs truncate">
                <Mail size={16} className="text-slate-500" />
                {order.email || "No email provided"}
              </div>

              <div className="mt-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col justify-center items-center">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Package size={10} /> Items
                </span>
                <span className="text-lg font-bold">{order.line_items?.length}</span>
              </div>

              <div className="mt-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col justify-center items-center">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                  <DollarSign size={10} /> Total
                </span>
                <span className="text-lg font-bold text-emerald-400">${order.total_price}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State for Mobile */}
        {filtered.length === 0 && !loading && (
             <div className="text-center text-slate-500 py-10 border border-slate-800 rounded-xl bg-slate-900/50">
               No orders found
             </div>
        )}
      </div>

    </div>
  );
}

// 🎨 Helper for Payment Status Colors
function PaymentBadge({ status }) {
  let styles = "bg-slate-700 text-slate-300 border-slate-600";

  if (status === "paid") {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (status === "pending" || status === "authorized") {
    styles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (status === "refunded" || status === "voided") {
    styles = "bg-red-500/10 text-red-400 border-red-500/20";
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} capitalize`}>
      {status}
    </span>
  );
}