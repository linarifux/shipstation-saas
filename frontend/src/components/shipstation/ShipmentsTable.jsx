import React from "react";
import StatusBadge from "./StatusBadge";

export default function ShipmentsTable({ shipments, onOpenDrawer }) {
  return (
    <div className="hidden md:block rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-4 font-medium">Shipment #</th>
            <th className="p-4 font-medium">Order #</th>
            <th className="p-4 font-medium">Recipient</th>
            <th className="p-4 font-medium">Carrier</th>
            <th className="p-4 font-medium">Service</th>
            <th className="p-4 font-medium">Weight</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Ship Date</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr
              key={s.shipment_id}
              onClick={() => onOpenDrawer(s)}
              className="border-t border-slate-800 hover:bg-slate-800/50 transition cursor-pointer"
            >
              <td className="p-4 font-medium text-cyan-400">{s.shipment_number}</td>
              <td className="p-4">{s.external_order_id || "-"}</td>
              <td className="p-4">{s.ship_to?.name}</td>
              <td className="p-4">{s.carrier_id}</td>
              <td className="p-4">
                <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                  {s.service_code}
                </span>
              </td>
              <td className="p-4">
                {s.total_weight?.value} {s.total_weight?.unit}
              </td>
              <td className="p-4">
                <StatusBadge status={s.shipment_status} />
              </td>
              <td className="p-4 text-slate-400">
                {s.ship_date ? new Date(s.ship_date).toLocaleDateString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}