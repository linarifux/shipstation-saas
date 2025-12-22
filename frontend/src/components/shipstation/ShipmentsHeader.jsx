import React from "react";

export default function ShipmentsHeader({ onRefresh }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">📦 Shipments</h1>
      <button
        onClick={onRefresh}
        className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow text-white font-medium transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}