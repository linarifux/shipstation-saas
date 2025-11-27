import { RefreshCcw } from "lucide-react";

export default function ShopifyInventoryHeader({ onRefresh }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold">
        🛒 Shopify Inventory
      </h1>

      <button
        onClick={onRefresh}
        className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 flex items-center gap-2"
      >
        <RefreshCcw size={16} /> Refresh
      </button>
    </div>
  );
}
