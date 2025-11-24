import { X } from "lucide-react";

export default function ProductDrawer({ open, onClose, product }) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-[450px] bg-slate-900 border-l border-slate-800 p-6 relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {product.name}
        </h2>

        <div className="space-y-2 text-slate-300">
          <p><strong>SKU:</strong> {product.masterSku}</p>
          <p><strong>Total Stock:</strong> {product.totalStock}</p>
          <p><strong>Active Channels:</strong> {product.channels?.length}</p>
        </div>

        <h3 className="mt-6 text-slate-100 font-semibold">Connected Stores</h3>

        <ul className="mt-3 space-y-2 text-sm">
          {product.channels?.map((c) => (
            <li key={c.channel}>
              ✅ {c.channel.toUpperCase()} — {c.channelSku}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
