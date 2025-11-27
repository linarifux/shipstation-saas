import { X, Trash2, Edit3, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";

export default function WarehouseDrawer({ open, onClose, warehouse }) {
  if (!open || !warehouse) return null;

  const [loading, setLoading] = useState(false);

  const address = warehouse.address || {};

  const handleDelete = async () => {
    if (!window.confirm("Delete this warehouse permanently?")) return;

    setLoading(true);
    await axios.delete(`http://localhost:5000/api/warehouses/${warehouse._id}`);
    setLoading(false);
    onClose();
    window.location.reload();
  };

  const setAsDefault = async () => {
    setLoading(true);

    await axios.put(`http://localhost:5000/api/warehouses/${warehouse._id}`, {
      isDefault: true
    });

    setLoading(false);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

      <div className="w-[450px] bg-slate-900 border-l border-slate-800 p-6 relative overflow-y-auto">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          <X />
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-1">
          {warehouse.name}
        </h2>
        <p className="text-xs text-slate-500 mb-3">{warehouse.code}</p>

        {warehouse.isDefault && (
          <span className="inline-block px-3 py-1 mb-4 rounded bg-emerald-600/30 text-emerald-300 text-sm">
            ✅ DEFAULT WAREHOUSE
          </span>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mb-6">
          {!warehouse.isDefault && (
            <button
              onClick={setAsDefault}
              className="flex-1 px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-sm flex items-center justify-center gap-1"
            >
              <CheckCircle2 size={14} />
              Set Default
            </button>
          )}

          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 rounded bg-red-600/80 hover:bg-red-700 text-sm flex items-center justify-center gap-1"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        {/* ADDRESS */}
        <Section title="Address">
          <Line label="Address" value={address.address_line1} />
          <Line label="City" value={address.city} />
          <Line label="State" value={address.state} />
          <Line label="Postal" value={address.postal_code} />
          <Line label="Country" value={address.country} />
        </Section>

        {/* CHANNEL CONNECTIONS */}
        <Section title="Connected Channels">
          <Line label="ShipStation ID" value={warehouse.shipstationWarehouseId} />
          <Line label="Shopify Location ID" value={warehouse.shopifyLocationId} />
          <Line label="Amazon Fulfillment ID" value={warehouse.amazonFulfillmentId} />
          <Line label="Walmart Node ID" value={warehouse.walmartNodeId} />
        </Section>

        {/* META */}
        <Section title="Metadata">
          <Line
            label="Created"
            value={new Date(warehouse.createdAt).toLocaleString()}
          />
          <Line
            label="Updated"
            value={new Date(warehouse.updatedAt).toLocaleString()}
          />
        </Section>

        {loading && (
          <p className="text-center text-sm text-slate-400 mt-4">
            Updating...
          </p>
        )}
      </div>
    </div>
  );
}

/* -------- SUB COMPONENTS -------- */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm text-cyan-400 mb-2 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-1 text-sm text-slate-300">
        {children}
      </div>
    </div>
  );
}

function Line({ label, value }) {
  return (
    <p>
      <strong className="text-slate-400">{label}:</strong>{" "}
      {value || <span className="text-slate-600">Not set</span>}
    </p>
  );
}
