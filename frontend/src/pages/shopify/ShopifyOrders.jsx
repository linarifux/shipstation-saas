import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";

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
      <div className="p-10 text-center text-white justify-center items-center flex">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">🛒 Shopify Orders</h1>

        <button
          onClick={fetchOrders}
          className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700"
        >
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by order # or customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-3 py-2 bg-slate-800 rounded border border-slate-700"
      />

      <div className="overflow-x-auto bg-slate-900 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Total</th>
              <th className="p-3">Items</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="border-t border-slate-800 hover:bg-slate-800/40"
              >
                <td className="p-3">{order.name}</td>
                <td className="p-3">
                  {order.customer
                    ? `${order.customer.first_name} ${order.customer.last_name}`
                    : "Guest"}
                </td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">${order.total_price}</td>
                <td className="p-3">{order.line_items?.length}</td>
                <td className="p-3 capitalize">
                  {order.financial_status}
                </td>
                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
