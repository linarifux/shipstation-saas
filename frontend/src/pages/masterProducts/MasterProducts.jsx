import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, Edit3, PlusCircle } from "lucide-react";
import { HashLoader } from "react-spinners";

import AddStockModal from "./components/AddStockModal";
import AddProductModal from "./components/AddProductModal";

export default function MasterProducts() {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState("");
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:5000/api/master-products");
      setProducts(res.data?.products || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load products. Check database connection.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleRow = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-white justify-center items-center flex h-[60vh]">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-6 text-slate-100">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">🧾 Master Products</h1>

        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white"
          >
            Refresh
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <Th />
              <Th label="Product" />
              <Th label="Master SKU" />
              <Th label="Total Available" />
              <Th label="Channels" />
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <MasterProductRow
                key={p._id}
                product={p}
                expanded={!!expanded[p._id]}
                onToggle={() => toggleRow(p._id)}
                onUpdated={fetchProducts}
                onAddStock={(product) => {
                  setSelectedProduct(product);
                  setStockModalOpen(true);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !error && (
        <div className="text-center text-xl my-6 text-slate-400">
          No products found. Add your first Master Product.
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      <AddProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={fetchProducts}
      />

      {/* ✅ ADD STOCK MODAL */}
      <AddStockModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        product={selectedProduct}
        onUpdated={fetchProducts}
      />

    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Th({ label }) {
  return (
    <th className="p-3 text-left text-xs font-medium uppercase tracking-wide">
      {label || ""}
    </th>
  );
}

function MasterProductRow({ product, expanded, onToggle, onUpdated, onAddStock }) {
  const totalAvailable =
    product.totalAvailable ??
    (product.locations || []).reduce((sum, l) => sum + (l.available || 0), 0);

  const channelBadges = [];
  if (product.channels?.shopify?.sku) channelBadges.push("Shopify");
  if (product.channels?.amazon?.sku || product.channels?.amazon?.asin)
    channelBadges.push("Amazon");
  if (product.channels?.walmart?.sku) channelBadges.push("Walmart");
  if (product.channels?.shipstation?.sku) channelBadges.push("ShipStation");

  return (
    <>
      <tr className="border-t border-slate-800 hover:bg-slate-800/40">

        {/* EXPAND */}
        <td className="p-3 w-8">
          <button onClick={onToggle} className="text-slate-300 hover:text-white">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        </td>

        {/* PRODUCT NAME + ADD STOCK */}
        <td className="p-3">
          <div className="font-medium">{product.name}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddStock(product);
            }}
            className="flex items-center gap-1 mt-1 text-xs text-cyan-400 hover:text-cyan-300"
          >
            <PlusCircle size={14} /> Add stock
          </button>
        </td>

        {/* SKU */}
        <td className="p-3 font-mono text-xs">{product.masterSku}</td>

        {/* TOTAL */}
        <td className="p-3 font-semibold text-cyan-400">
          {totalAvailable}
        </td>

        {/* CHANNELS */}
        <td className="p-3">
          <div className="flex flex-wrap gap-2">
            {channelBadges.length === 0 && (
              <span className="text-xs text-slate-500">No channels linked</span>
            )}
            {channelBadges.map((ch) => (
              <span
                key={ch}
                className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-200 border border-slate-700"
              >
                {ch}
              </span>
            ))}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-slate-950/70 border-t border-slate-800">
          <td colSpan={5} className="p-4">
            <LocationsTable product={product} onUpdated={onUpdated} />
          </td>
        </tr>
      )}
    </>
  );
}

function LocationsTable({ product, onUpdated }) {
  const [editing, setEditing] = useState({});

  const handleChange = (warehouseId, value) => {
    setEditing((prev) => ({ ...prev, [warehouseId]: value }));
  };

  const handleUpdate = async (warehouseId) => {
    const newQty = Number(editing[warehouseId]);
    if (Number.isNaN(newQty)) return;

    await axios.patch(
      `http://localhost:5000/api/master-products/${product._id}/stock`,
      {
        warehouseId,
        available: newQty,
      }
    );

    setEditing((prev) => ({ ...prev, [warehouseId]: undefined }));
    onUpdated();
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-200 mb-2">
        Stock by Warehouse
      </h3>

      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-2 text-left">Warehouse</th>
              <th className="p-2 text-left">On Hand</th>
              <th className="p-2 text-left">Reserved</th>
              <th className="p-2 text-left">Available</th>
              <th className="p-2 text-left">Safety</th>
              <th className="p-2 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {(product.locations || []).map((loc) => (
              <tr
                key={loc.warehouse?._id || loc.warehouse}
                className="border-t border-slate-800"
              >
                <td className="p-2">
                  <div className="font-medium">
                    {loc.warehouse?.name || "Unknown"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {loc.warehouse?.code}
                  </div>
                </td>

                <td className="p-2">{loc.onHand || 0}</td>
                <td className="p-2">{loc.reserved || 0}</td>

                <td className="p-2 font-semibold text-cyan-400">
                  {loc.available}
                </td>

                <td className="p-2">{loc.safetyStock || 0}</td>

                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                      value={
                        editing[loc.warehouse?._id || loc.warehouse] ??
                        loc.available ??
                        0
                      }
                      onChange={(e) =>
                        handleChange(
                          loc.warehouse?._id || loc.warehouse,
                          e.target.value
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        handleUpdate(loc.warehouse?._id || loc.warehouse)
                      }
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-[11px]"
                    >
                      <Edit3 size={12} /> Save
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {(!product.locations || product.locations.length === 0) && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-slate-500">
                  No warehouse locations linked to this product yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
