import { X, Link2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LinkShipstationModal({
  open,
  onClose,
  shipstationProduct, // The product from ShipStation you want to link
  masterProducts,     // List of all Master Products to choose from
  onLinked,           // Callback to refresh data after linking
}) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset dropdown when reopening
  useEffect(() => {
    if (open) {
      setSelected("");
    }
  }, [open]);

  if (!open || !shipstationProduct) return null;

  async function handleLink() {
    if (!selected) {
      toast.error("Please select a Master Product");
      return;
    }

    try {
      setLoading(true);

      // ✅ Call the new ShipStation Link Endpoint
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/master-products/${selected}/link-shipstation`,
        {
          sku: shipstationProduct.sku,
          productId: shipstationProduct.productId, // Adjust if your SS data uses 'id' or 'product_id'
        }
      );

      toast.success("ShipStation product linked successfully!");
      
      onLinked(); // Refresh the parent table
      onClose();
    } catch (err) {
      console.error("Link error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to link product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            <Link2 className="text-indigo-400" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-slate-100">
            Link ShipStation Product
          </h2>
        </div>

        {/* Product Info (The one being linked) */}
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 mb-6">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
            Linking ShipStation Item
          </p>
          <p className="font-medium text-slate-200 truncate">
            {shipstationProduct.name}
          </p>
          <p className="text-sm text-slate-400 font-mono mt-0.5">
            SKU: {shipstationProduct.sku}
          </p>
        </div>

        {/* Selection Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Master Product
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="">-- Choose Master Product --</option>
            {masterProducts.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (SKU: {p.masterSku})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2">
            This will connect inventory sync between ShipStation and your Master record.
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={handleLink}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Linking...
            </>
          ) : (
            "Link Product"
          )}
        </button>
      </div>
    </div>
  );
}