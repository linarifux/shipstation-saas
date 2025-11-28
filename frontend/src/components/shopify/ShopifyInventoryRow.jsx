import { useState } from "react";
import { Link2, ArrowUpDown, Unlink, Loader2 } from "lucide-react";

export default function ShopifyInventoryRow({
  product,
  level,
  locationName,
  master,
  onUpdate,
  onSync,
  onLink,
  onUnlink,
}) {
  const [qty, setQty] = useState(level.available);

  const [updating, setUpdating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  const isBusy = updating || syncing || unlinking;

  async function handleUpdate() {
    if (qty === "" || isNaN(qty)) return alert("Enter a valid quantity");

    try {
      setUpdating(true);
      await onUpdate(product.inventory_item_id, level.location_id, qty);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSync() {
    if (!master) return;

    try {
      setSyncing(true);
      await onSync();
    } finally {
      setSyncing(false);
    }
  }

  async function handleUnlink() {
    if (!master) return;

    const confirm = window.confirm(
      `Unlink Shopify product "${product.title}" from Master Product "${master.name}"?`
    );

    if (!confirm) return;

    try {
      setUnlinking(true);
      await onUnlink(master._id);
    } finally {
      setUnlinking(false);
    }
  }

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-800/40 transition">

      {/* PRODUCT TITLE */}
      <td className="p-3 font-medium">
        <div>{product.title}</div>
        <div className="text-[10px] text-slate-500">
          {product.product_id}
        </div>
      </td>

      {/* SKU */}
      <td className="p-3 text-xs font-mono">{product.sku}</td>

      {/* LOCATION */}
      <td className="p-3">
        {locationName || (
          <span className="text-slate-500">{level.location_id}</span>
        )}
      </td>

      {/* CURRENT QTY */}
      <td className="p-3 font-bold text-cyan-400">
        {level.available}
      </td>

      {/* MASTER LINK STATUS */}
      <td className="p-3">
        {master ? (
          <div className="flex flex-col gap-2">

            <span className="text-green-400 text-xs flex items-center gap-1">
              <Link2 size={12} /> {master.name}
            </span>

            <button
              onClick={handleSync}
              disabled={isBusy}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-2 py-1 rounded text-xs"
            >
              {syncing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <ArrowUpDown size={12} />
              )}
              Sync
            </button>

            <button
              onClick={handleUnlink}
              disabled={isBusy}
              className="flex items-center gap-1 text-red-400 hover:text-red-500 disabled:opacity-50 text-xs"
            >
              <Unlink size={12} />
              {unlinking ? "..." : "Unlink"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onLink(product)}
            disabled={isBusy}
            className="bg-cyan-700 hover:bg-cyan-800 px-2 py-1 text-xs rounded disabled:opacity-50"
          >
            Link Product
          </button>
        )}
      </td>

      {/* NEW QTY INPUT */}
      <td className="p-3">
        <input
          type="number"
          min="0"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded"
        />
      </td>

      {/* UPDATE BUTTON */}
      <td className="p-3">
        <button
          onClick={handleUpdate}
          disabled={updating || qty === ""}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-3 py-1 rounded text-sm"
        >
          {updating ? <Loader2 size={14} className="animate-spin" /> : "Update"}
        </button>
      </td>

    </tr>
  );
}
