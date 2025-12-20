import { useState } from "react";
import ShopifyInventoryRow from "./ShopifyInventoryRow";
import { getMasterMatch } from "../../utils/getMasterMatch";
import toast from "react-hot-toast";
import axios from "axios"; // Only needed for the local unlink helper if not in Redux yet
import { 
  Package, MapPin, Link2, AlertCircle, ArrowUpDown, 
  Unlink, Loader2, Edit2, Check, X as XIcon 
} from "lucide-react";

export default function ShopifyInventoryTable({
  products = [],
  masterProducts = [],
  locations = {},
  onUpdate,     // ✅ Redux Action from Parent
  onUpdateSku,  // ✅ Redux Action from Parent
  onSync,       // ✅ Redux Action from Parent
  onLink,
  refresh,
}) {
  if (!products || products.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400">
        No Shopify inventory found.
      </div>
    );
  }

  // Helper for unlinking (can remain local or move to Redux later)
  async function unlinkShopify(masterId) {
    if (!masterId) return;
    try {
      await toast.promise(
        axios.patch(`${import.meta.env.VITE_BACKEND_URL}/master-products/${masterId}/unlink-shopify`),
        {
          loading: 'Unlinking product...',
          success: 'Product unlinked successfully!',
          error: 'Failed to unlink this product',
        }
      );
      if (refresh) refresh();
    } catch (error) {
      console.error("Unlink failed", error);
    }
  }

  return (
    <>
      {/* 🖥️ DESKTOP VIEW: Table */}
      <div className="hidden md:block overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Location</th>
              <th className="p-3">Shopify Qty</th>
              <th className="p-3">Master Status</th>
              <th className="p-3">New Qty</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              if (!item?.levels || item.levels.length === 0) return null;
              return item.levels.map((lvl) => {
                const master = getMasterMatch(masterProducts, item.sku);
                const locationName = locations ? locations[lvl.location_id] : null;
                return (
                  <ShopifyInventoryRow
                    key={`${item.inventory_item_id}-${lvl.location_id}-${index}`}
                    product={item}
                    level={lvl}
                    locationName={locationName}
                    master={master}
                    onUpdate={onUpdate}
                    onUpdateSku={onUpdateSku} /* ✅ Uses Prop (Redux) */
                    onSync={() => {
                      if (!master) return toast.error("No master product linked");
                      return onSync(master);
                    }}
                    onLink={() => onLink(item)}
                    onUnlink={() => {
                      if (!master?._id) return;
                      return unlinkShopify(master._id);
                    }}
                  />
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE VIEW: Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((item, index) => {
          if (!item?.levels || item.levels.length === 0) return null;
          return item.levels.map((lvl) => {
            const master = getMasterMatch(masterProducts, item.sku);
            const locationName = locations ? locations[lvl.location_id] : null;

            return (
              <MobileInventoryCard
                key={`mobile-${item.inventory_item_id}-${lvl.location_id}-${index}`}
                product={item}
                level={lvl}
                locationName={locationName}
                master={master}
                onUpdate={onUpdate}
                onUpdateSku={onUpdateSku} /* ✅ Uses Prop (Redux) */
                onSync={onSync}
                onLink={onLink}
                onUnlink={unlinkShopify}
              />
            );
          });
        })}
      </div>
    </>
  );
}

/* 📱 MOBILE CARD COMPONENT */
function MobileInventoryCard({ product, level, locationName, master, onUpdate, onUpdateSku, onSync, onLink, onUnlink }) {
  const [qty, setQty] = useState(level.available);
  
  // ✅ SKU Edit State
  const [sku, setSku] = useState(product.sku || ""); 
  const [isEditingSku, setIsEditingSku] = useState(false);
  const [updatingSku, setUpdatingSku] = useState(false);

  // Other Loading States
  const [updating, setUpdating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  const isBusy = updating || syncing || unlinking || updatingSku;

  async function handleUpdate() {
    if (qty === "" || isNaN(qty)) return toast.error("Enter a valid quantity");
    try {
      setUpdating(true);
      await toast.promise(onUpdate(product.inventory_item_id, level.location_id, qty), {
        loading: "Updating...",
        success: "Updated",
        error: "Failed",
      });
    } finally { setUpdating(false); }
  }

  // ✅ SKU Save Handler (Uses Redux via Prop)
  async function handleSkuSave() {
    if (!sku || sku.trim() === "") return toast.error("SKU cannot be empty");
    try {
      setUpdatingSku(true);
      
      // Call Redux Action passed from Parent
      await onUpdateSku(product.inventory_item_id, sku);
      
      toast.success("SKU Updated");
      setIsEditingSku(false);
    } catch(err) {
      console.error(err);
      toast.error("Failed to update SKU");
    } finally { 
      setUpdatingSku(false); 
    }
  }

  async function handleSync() {
    if (!master) return toast.error("No master product linked");
    try {
      setSyncing(true);
      await toast.promise(onSync(master), {
        loading: "Syncing...",
        success: "Synced",
        error: "Failed",
      });
    } finally { setSyncing(false); }
  }

  async function handleUnlink() {
    if (!master) return;
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Unlink {master.name}?</span>
        <div className="flex gap-2">
          <button onClick={() => { toast.dismiss(t.id); executeUnlink(); }} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Yes</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-700 text-white px-2 py-1 rounded text-xs">Cancel</button>
        </div>
      </div>
    ));
  }

  async function executeUnlink() {
    try {
      setUnlinking(true);
      await onUnlink(master._id);
    } finally { setUnlinking(false); }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      
      {/* Header: Title & SKU */}
      <div className="mb-4">
        <h3 className="text-slate-100 font-semibold text-base leading-snug mb-2">{product.title}</h3>
        
        {/* ✅ SKU Section with Edit Mode */}
        <div className="flex items-center justify-between h-8">
          {isEditingSku ? (
             <div className="flex items-center gap-2 w-full animate-in fade-in duration-200">
               <input 
                 value={sku}
                 onChange={(e) => setSku(e.target.value)}
                 className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full focus:border-cyan-500 outline-none font-mono"
                 placeholder="Enter SKU"
                 autoFocus
               />
               <button 
                 onClick={handleSkuSave} 
                 disabled={updatingSku}
                 className="bg-emerald-600 p-1.5 rounded text-white hover:bg-emerald-500 disabled:opacity-50"
               >
                 {updatingSku ? <Loader2 size={12} className="animate-spin"/> : <Check size={12} />}
               </button>
               <button 
                 onClick={() => { setIsEditingSku(false); setSku(product.sku || ""); }} 
                 className="bg-slate-700 p-1.5 rounded text-white hover:bg-slate-600"
               >
                 <XIcon size={12} />
               </button>
             </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 font-mono whitespace-nowrap">
                {product.sku || "NO SKU"}
              </span>
              <button 
                onClick={() => setIsEditingSku(true)} 
                className="text-slate-500 hover:text-cyan-400 transition-colors"
                title="Edit SKU"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
          <MapPin size={12} />
          {locationName || level.location_id}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
        <div>
          <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Current Stock</label>
          <div className="text-xl font-bold text-cyan-400">{level.available}</div>
        </div>
        
        <div>
           <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Linked Master</label>
           {master ? (
             <div className="flex items-center gap-1 text-green-400 text-xs mt-1 font-medium truncate">
               <Link2 size={12} /> {master.name}
             </div>
           ) : (
             <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 italic">
               <AlertCircle size={12} /> Not Linked
             </div>
           )}
        </div>
      </div>

      {/* Actions Area */}
      <div className="flex flex-col gap-3">
        
        {/* Update Input & Button */}
        <div className="flex gap-2">
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-20 bg-slate-950 border border-slate-700 rounded px-2 text-center text-sm focus:border-cyan-500 outline-none"
            placeholder="Qty"
          />
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : "Update Qty"}
          </button>
        </div>

        {/* Master Actions */}
        <div className="flex gap-2">
          {master ? (
            <>
              <button
                onClick={handleSync}
                disabled={isBusy}
                className="flex-1 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs py-2 rounded flex items-center justify-center gap-1 transition-colors"
              >
                {syncing ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpDown size={14} />}
                Sync
              </button>
              <button
                onClick={handleUnlink}
                disabled={isBusy}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs py-2 rounded flex items-center justify-center gap-1 transition-colors"
              >
                 <Unlink size={14} />
                 {unlinking ? "..." : "Unlink"}
              </button>
            </>
          ) : (
            <button
              onClick={() => onLink(product)}
              disabled={isBusy}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Link2 size={14} /> Link to Master Product
            </button>
          )}
        </div>

      </div>
    </div>
  );
}