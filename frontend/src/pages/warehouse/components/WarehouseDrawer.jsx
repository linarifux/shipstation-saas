import { X } from "lucide-react";

export default function WarehouseDrawer({ open, onClose, warehouse }) {
  if (!open || !warehouse) return null;

  const o = warehouse.origin_address;
  const r = warehouse.return_address;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-[450px] bg-slate-900 border-l border-slate-800 p-6 relative overflow-y-auto">

        <button onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {warehouse.name}
        </h2>

        {warehouse.is_default && (
          <span className="inline-block px-3 py-1 mb-4 rounded bg-green-600/30 text-green-300 text-sm">
            DEFAULT WAREHOUSE
          </span>
        )}

        {/* ORIGIN ADDRESS */}
        <Section title="Origin Address" data={o} />

        {/* RETURN ADDRESS */}
        <Section title="Return Address" data={r} />

      </div>
    </div>
  );
}

function Section({ title, data }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm text-cyan-400 mb-2 uppercase tracking-wide">
        {title}
      </h3>

      <div className="text-slate-300 space-y-1 text-sm">
        <p><strong>Name:</strong> {data?.name}</p>
        <p><strong>Company:</strong> {data?.company_name}</p>
        <p><strong>Email:</strong> {data?.email}</p>
        <p><strong>Phone:</strong> {data?.phone}</p>
        <p><strong>Address:</strong> {data?.address_line1}</p>
        <p><strong>City:</strong> {data?.city_locality}</p>
        <p><strong>State:</strong> {data?.state_province}</p>
        <p><strong>Postal:</strong> {data?.postal_code}</p>
        <p><strong>Country:</strong> {data?.country_code}</p>
      </div>
    </div>
  );
}
