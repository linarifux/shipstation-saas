import { useState } from "react";
import { Link2, ArrowUpDown, Unlink, Loader2 } from "lucide-react";
import toast from "react-hot-toast"; // 1. Import toast

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
    // 2. Replace alert with toast error
    if (qty === "" || isNaN(qty)) {
      toast.error("Enter a valid quantity");
      return;
    }

    try {
      setUpdating(true);
      
      // 3. Wrap the async update in a promise toast
      await toast.promise(
        onUpdate(product.inventory_item_id, level.location_id, qty),
        {
          loading: "Updating quantity...",
          success: "Quantity updated",
          error: "Failed to update quantity",
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSync() {
    if (!master) return;

    try {
      setSyncing(true);
      
      // 4. Wrap sync action in promise toast
      await toast.promise(onSync(), {
        loading: "Syncing with master...",
        success: "Sync complete",
        error: "Sync failed",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }

  function handleUnlink() {
    if (!master) return;

    // Trigger a custom toast
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">
            Unlink from <span className="font-bold">{master.name}</span>?
          </span>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id); // Close the confirmation toast
                executeUnlink();     // Run the actual unlink logic
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded transition"
            >
              Yes, Unlink
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000, // Keep it open longer so user has time to decide
        style: {
          background: '#1e293b', // slate-800
          color: '#fff',
          border: '1px solid #334155', // slate-700
        },
      }
    );
  }

  // ✅ Separate the actual async logic into its own function
  async function executeUnlink() {
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
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-2 py-1 rounded text-xs transition-colors"
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
              className="flex items-center gap-1 text-red-400 hover:text-red-500 disabled:opacity-50 text-xs transition-colors"
            >
              <Unlink size={12} />
              {unlinking ? "..." : "Unlink"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onLink(product)}
            disabled={isBusy}
            className="bg-cyan-700 hover:bg-cyan-800 px-2 py-1 text-xs rounded disabled:opacity-50 transition-colors"
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
          className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-600"
        />
      </td>

      {/* UPDATE BUTTON */}
      <td className="p-3">
        <button
          onClick={handleUpdate}
          disabled={updating || qty === ""}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-3 py-1 rounded text-sm transition-colors flex items-center justify-center min-w-[70px]"
        >
          {updating ? <Loader2 size={14} className="animate-spin" /> : "Update"}
        </button>
      </td>

    </tr>
  );
}