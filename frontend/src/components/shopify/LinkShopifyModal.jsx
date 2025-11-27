import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function LinkShopifyModal({
  open,
  onClose,
  shopifyProduct,
  masterProducts,
  onLinked,
}) {
  const [selected, setSelected] = useState("");

  if (!open || !shopifyProduct) return null;

  async function handleLink() {
    if (!selected) return alert("Select a product");

    await axios.patch(
      `http://localhost:5000/api/master-products/${selected}/link-shopify`,
      {
        sku: shopifyProduct.sku,
        productId: shopifyProduct.product_id,
        variantId: shopifyProduct.variant_id,
      }
    );

    onLinked();
    onClose();
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

        <h2 className="text-lg font-semibold mb-4">
          Link to Master Product
        </h2>

        <p className="text-sm text-slate-400 mb-4">
          Shopify: {shopifyProduct.title} / {shopifyProduct.sku}
        </p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded mb-6"
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
          className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded"
        >
          Link Product
        </button>
      </div>
    </div>
  );
}
