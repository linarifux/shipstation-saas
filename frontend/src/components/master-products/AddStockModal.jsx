import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function AddStockModal({ open, onClose, product, onUpdated }) {
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch warehouses whenever modal opens
  useEffect(() => {
    if (open) {
      fetchWarehouses();
    }
  }, [open]);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouses");
      setWarehouses(res.data.warehouses || []);
    } catch (err) {
      console.error("Failed to load warehouses", err);
    }
  };

  const handleSubmit = async () => {
    if (!warehouseId || !quantity) {
      alert("Please select a warehouse and enter quantity");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        `http://localhost:5000/api/master-products/${product._id}/add-stock`,
        {
          warehouseId,
          quantity: parseInt(quantity),
        }
      );

      // Reset + refresh
      setWarehouseId("");
      setQuantity("");

      onUpdated();
      onClose();

    } catch (err) {
      console.error("Server error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">

      <div className="w-[420px] bg-slate-900 border border-slate-800 rounded-xl p-6 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-1">
          Add Stock
        </h2>

        <p className="text-xs text-slate-400 mb-4">
          {product.name} • {product.masterSku}
        </p>

        {/* Warehouse select */}
        <div className="mb-4">
          <label className="block text-xs mb-1 text-slate-300">
            Select Warehouse
          </label>

          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
          >
            <option value="">Select warehouse</option>

            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} — {w.address?.city}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-xs mb-1 text-slate-300">
            Quantity to Add
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
            placeholder="Enter amount..."
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg text-white font-medium"
        >
          {loading ? "Adding..." : "Add Stock"}
        </button>

      </div>
    </div>
  );
}
