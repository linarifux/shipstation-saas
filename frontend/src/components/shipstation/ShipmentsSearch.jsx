import React from "react";

export default function ShipmentsSearch({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by shipment # or customer name…"
      className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 w-full mb-6 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}