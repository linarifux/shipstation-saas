import { useEffect, useState } from "react";
import axios from "axios";

export default function AddProductModal({ open, onClose, onCreated }) {
  const [warehouses, setWarehouses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    masterSku: "",
    price: 0
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  async function fetchWarehouses() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/warehouse`);
      setWarehouses(res.data.warehouses || []);
    } catch (e) {
      console.log(e);
    }
  }

  const handleLocationQty = (warehouseId, value) => {
    setLocations((prev) => {
      const filtered = prev.filter((l) => l.warehouse !== warehouseId);
      return [...filtered, { warehouse: warehouseId, available: Number(value) }];
    });
  };

  const handleCreate = async () => {
    if (!form.name || !form.masterSku) return;

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/master-products`, {
      ...form,
      locations
    });

    onCreated();
    onClose();

    setForm({ name: "", masterSku: "", price: 0 });
    setLocations([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 w-[600px] rounded-xl border border-slate-800 p-6 text-white">

        <h2 className="text-2xl font-semibold mb-4">➕ Add New Product</h2>

        {/* PRODUCT INFO */}
        <div className="space-y-3 mb-5">
          <input
            placeholder="Product Name"
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Master SKU"
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            value={form.masterSku}
            onChange={(e) => setForm({ ...form, masterSku: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        {/* LOCATION STOCK */}
        <h3 className="text-lg font-semibold mb-2">Stock by Warehouse</h3>

        <div className="space-y-2 max-h-[200px] overflow-y-auto mb-5">
          {warehouses.map((w) => (
            <div key={w._id} className="flex justify-between items-center gap-3">

              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-xs text-slate-500">{w.code}</p>
              </div>

              <input
                type="number"
                placeholder="Qty"
                className="w-28 bg-slate-800 p-2 rounded border border-slate-700"
                onChange={(e) => handleLocationQty(w._id, e.target.value)}
              />

            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700"
          >
            Create Product
          </button>
        </div>

      </div>
    </div>
  );
}
