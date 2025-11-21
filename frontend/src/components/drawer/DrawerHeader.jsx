import { X } from "lucide-react";

export default function DrawerHeader({ shipment, onClose }) {
  return (
    <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Shipment #{shipment.shipment_number}
        </h2>
        <p className="text-sm text-slate-400">
          {shipment.shipment_status.toUpperCase()}
        </p>
      </div>

      <button onClick={onClose} className="text-slate-300 hover:text-white">
        <X size={22} />
      </button>
    </div>
  );
}
