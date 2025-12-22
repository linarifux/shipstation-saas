import { useState } from "react";
import { Link2, AlertCircle, RefreshCw, Loader2, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ShopifyInventoryRow({
  product,
  level,
  locationName,
  master,
  onUpdate,
  onUpdateSku,
  onLink,
  onUnlink,
}) {
  const [qty, setQty] = useState(level.available);
  const [loading, setLoading] = useState(false);
  
  // SKU Edit State
  const [isEditingSku, setIsEditingSku] = useState(false);
  const [sku, setSku] = useState(product.sku);
  const [savingSku, setSavingSku] = useState(false);

  const handleUpdateStock = async () => {
    try {
      setLoading(true);
      await onUpdate(product.inventory_item_id, level.location_id, qty);
      toast.success("Stock updated");
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSku = async () => {
    if (!sku || !sku.trim()) return toast.error("SKU cannot be empty");
    try {
      setSavingSku(true);
      await onUpdateSku(product.inventory_item_id, sku);
      setIsEditingSku(false);
    } catch (err) {
      // Error handled by parent
    } finally {
      setSavingSku(false);
    }
  };

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
      {/* Product Name */}
      <td className="p-3 font-medium text-slate-200 max-w-xs truncate" title={product.title}>
        {product.title}
      </td>

      {/* SKU (Editable) */}
      <td className="p-3 font-mono text-slate-400">
        {isEditingSku ? (
          <div className="flex items-center gap-2">
            <input 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-32 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-500 outline-none"
              autoFocus
            />
            <button onClick={handleSaveSku} disabled={savingSku} className="bg-emerald-600 p-1 rounded text-white hover:bg-emerald-500 disabled:opacity-50">
              {savingSku ? <Loader2 size={12} className="animate-spin"/> : <Check size={12} />}
            </button>
            <button onClick={() => { setIsEditingSku(false); setSku(product.sku); }} className="bg-slate-700 p-1 rounded text-white hover:bg-slate-600">
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <span>{product.sku || "NO SKU"}</span>
            <button onClick={() => setIsEditingSku(true)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-cyan-400 transition-opacity" title="Edit SKU">
              <Edit2 size={12} />
            </button>
          </div>
        )}
      </td>

      {/* Location */}
      <td className="p-3 text-slate-400 text-xs">
        {locationName || <span className="font-mono">{level.location_id}</span>}
      </td>

      {/* Current Qty */}
      <td className="p-3 text-cyan-400 font-bold">
        {level.available}
      </td>

      {/* Master Link Status */}
      <td className="p-3">
        {master ? (
          <div className="flex items-center gap-2">
            <Link2 size={14} className="text-emerald-500" />
            <span className="text-emerald-400 text-xs truncate max-w-[150px]">{master.name}</span>
            <button onClick={onUnlink} className="text-[10px] text-slate-500 hover:text-red-400 underline ml-2">
              Unlink
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-slate-600" />
            <button onClick={onLink} className="text-xs text-slate-500 hover:text-cyan-400 underline">
              Link Now
            </button>
          </div>
        )}
      </td>

      {/* Update Input */}
      <td className="p-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-cyan-500 outline-none"
          />
          <button onClick={handleUpdateStock} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white p-1.5 rounded disabled:opacity-50">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
        </div>
      </td>

      {/* Empty Cell (Sync Button Removed) */}
      <td className="p-3 text-right"></td>
    </tr>
  );
}