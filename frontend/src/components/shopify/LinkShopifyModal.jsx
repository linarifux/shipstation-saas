import { X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // 1. Import toast

export default function LinkShopifyModal({
  open,
  onClose,
  shopifyProduct,
  masterProducts,
  onLinked,
}) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset dropdown when reopening
  useEffect(() => {
    if (open) {
      setSelected("");
    }
  }, [open]);

  if (!open || !shopifyProduct) return null;

  async function handleLink() {
    if (!selected) {
      // 2. Replace alert with toast error
      toast.error("Please select a Master Product");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/master-products/${selected}/link-shopify`,
        {
          sku: shopifyProduct.sku,
          productId: shopifyProduct.product_id,
          variantId: shopifyProduct.variant_id,
          inventory_item_id: shopifyProduct.inventory_item_id,
        }
      );

      // 3. Add success toast for better UX
      toast.success("Product linked successfully!");
      
      onLinked();
      onClose();
    } catch (err) {
      console.error("Link error:", err.response?.data || err.message);
      // 4. Replace alert with toast error
      toast.error(err.response?.data?.message || "Failed to link product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="w-[480px] bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-white">
          Link to Master Product
        </h2>

        <p className="text-sm text-slate-400 mb-4">
          Shopify:{" "}
          <span className="font-semibold text-slate-200">{shopifyProduct.title}</span>{" "}
          • <span className="font-mono text-slate-300">{shopifyProduct.sku}</span>
        </p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 p-2 rounded mb-6 focus:ring-2 focus:ring-cyan-600 outline-none"
        >
          <option value="">Select Master Product</option>
          {masterProducts.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} • {p.masterSku}
            </option>
          ))}
        </select>

        <button
          onClick={handleLink}
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded font-medium transition-colors"
        >
          {loading ? "Linking..." : "Link Product"}
        </button>
      </div>
    </div>
  );
}