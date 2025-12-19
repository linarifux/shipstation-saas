import { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Trash2, CheckCircle2, Loader2, MapPin, Share2, Database } from "lucide-react";
import toast from "react-hot-toast";

// Import Actions
import { deleteWarehouse, setDefaultWarehouse } from "../../../store/slices/warehouseSlice";

export default function WarehouseDrawer({ open, onClose, warehouse }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (!open || !warehouse) return null;

  const address = warehouse.address || {};

  /* -------------------------------- */
  /* HANDLERS */
  /* -------------------------------- */

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${warehouse.name}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      await dispatch(deleteWarehouse(warehouse._id)).unwrap();
      toast.success("Warehouse deleted successfully");
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to delete warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async () => {
    setLoading(true);
    try {
      await dispatch(setDefaultWarehouse(warehouse._id)).unwrap();
      toast.success(`${warehouse.name} is now the default warehouse`);
      // We don't close the drawer here so the user can see the status update
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to update default status");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- */
  /* RENDER */
  /* -------------------------------- */

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Drawer Container */}
      <div className="w-[450px] bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-1">{warehouse.name}</h2>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                {warehouse.code}
              </span>
              {warehouse.isDefault && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                  <CheckCircle2 size={10} /> Default
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSetDefault}
              disabled={loading || warehouse.isDefault}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${warehouse.isDefault 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                  : "bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 border border-cyan-500/20"
                }
              `}
            >
              {loading && !warehouse.isDefault ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {warehouse.isDefault ? "Default Active" : "Set as Default"}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-sm font-medium transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Delete
            </button>
          </div>

          {/* Address Section */}
          <Section title="Location Address" icon={MapPin}>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-3 gap-y-4 text-sm">
                <Line label="Address" value={address.address_line1} span={3} />
                <Line label="City" value={address.city} />
                <Line label="State" value={address.state} />
                <Line label="Zip" value={address.postal_code} />
                <Line label="Country" value={address.country} span={3} />
              </div>
            </div>
          </Section>

          {/* Connected Channels */}
          <Section title="Channel Integrations" icon={Share2}>
            <div className="bg-slate-950/50 rounded-xl border border-slate-800 divide-y divide-slate-800">
              <ChannelLine label="ShipStation" value={warehouse.shipstationWarehouseId} />
              <ChannelLine label="Shopify" value={warehouse.shopifyLocationId} />
              <ChannelLine label="Amazon FBA" value={warehouse.amazonFulfillmentId} />
              <ChannelLine label="Walmart" value={warehouse.walmartNodeId} />
            </div>
          </Section>

          {/* Metadata */}
          <Section title="System Metadata" icon={Database}>
            <div className="text-xs text-slate-500 space-y-1 pl-1">
              <p>Created: {new Date(warehouse.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(warehouse.updatedAt).toLocaleString()}</p>
              <p className="font-mono mt-2 select-all">ID: {warehouse._id}</p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

/* -------- SUB COMPONENTS -------- */

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        {Icon && <Icon size={14} />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Line({ label, value, span = 1 }) {
  return (
    <div className={`col-span-${span}`}>
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">{label}</p>
      <p className="text-slate-200 font-medium truncate">
        {value || <span className="text-slate-600 italic">--</span>}
      </p>
    </div>
  );
}

function ChannelLine({ label, value }) {
  return (
    <div className="flex justify-between items-center p-3 text-sm">
      <span className="text-slate-400 font-medium">{label} ID</span>
      {value ? (
        <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20">
          {value}
        </span>
      ) : (
        <span className="text-slate-600 text-xs italic">Not Connected</span>
      )}
    </div>
  );
}