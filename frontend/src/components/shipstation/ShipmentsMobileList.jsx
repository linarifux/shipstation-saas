import React from "react";
import { Package, Truck, Calendar, User, Scale, FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ShipmentsMobileList({ shipments, onOpenDrawer }) {
  return (
    <div className="md:hidden flex flex-col gap-4">
      {shipments.map((s) => (
        <div
          key={s.shipment_id}
          onClick={() => onOpenDrawer(s)}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
        >
          {/* Top Row: ID + Status */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-cyan-400 font-bold text-lg flex items-center gap-2">
                <Package size={18} />
                {s.shipment_number}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <FileText size={12} />
                Order: {s.external_order_id || "N/A"}
              </div>
            </div>
            <StatusBadge status={s.shipment_status} />
          </div>

          {/* Middle Grid: Details */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <User size={12} /> Recipient
              </span>
              <span className="font-medium truncate">{s.ship_to?.name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Truck size={12} /> Carrier
              </span>
              <span className="font-medium uppercase">{s.carrier_id}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                Service
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs w-fit">
                {s.service_code}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Scale size={12} /> Weight
              </span>
              <span>
                {s.total_weight?.value} {s.total_weight?.unit}
              </span>
            </div>
          </div>

          {/* Bottom Row: Date */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              Shipped: {s.ship_date ? new Date(s.ship_date).toLocaleDateString() : "-"}
            </div>
            <span className="text-cyan-600 font-medium">View Details →</span>
          </div>
        </div>
      ))}
    </div>
  );
}