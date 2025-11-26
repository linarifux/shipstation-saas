import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";

export default function ShopifyInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/shopify/inventory");
    setProducts(res.data.products);
    setLoading(false);
  }

  async function updateStock(inventory_item_id, location_id, newQty) {
    await axios.post("http://localhost:5000/api/shopify/inventory/update", {
      inventory_item_id,
      location_id,
      available: Number(newQty)
    });

    fetchInventory();
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-white justify-center items-center flex">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">📦 Inventory by Location</h1>
        <button
          onClick={fetchInventory}
          className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-slate-900 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Location</th>
              <th className="p-3">Current Qty</th>
              <th className="p-3">Update Qty</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody >
            {products.map((item) =>
              item.levels.map((lvl) => (
                <InventoryRow
                  key={item.sku + lvl.location_id}
                  product={item}
                  level={lvl}
                  onUpdate={updateStock}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryRow({ product, level, onUpdate }) {
  const [qty, setQty] = useState(level.available);

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-800/40">
      <td className="p-3 font-medium">{product.title}</td>
      <td className="p-3">{product.sku}</td>
      <td className="p-3">{level.location_id}</td>
      <td className="p-3 font-bold text-cyan-400">{level.available}</td>
      <td className="p-3">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded"
        />
      </td>
      <td className="p-3">
        <button
          onClick={() =>
            onUpdate(product.inventory_item_id, level.location_id, qty)
          }
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
        >
          Update
        </button>
      </td>
    </tr>
  );
}
