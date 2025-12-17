import { Boxes, Edit, Layers, ShoppingBag } from "lucide-react";

export default function MasterProductsTable({ products, refresh, openStockModal }) {
  
  if (!products || products.length === 0) return null;

  return (
    <>
      {/* 🖥️ DESKTOP VIEW: Table (Hidden on Mobile) */}
      <div className="hidden md:block overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Available</th>
              <th className="p-4 font-medium">Channels</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr 
                key={p._id} 
                className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 font-medium text-white">
                  <div className="flex flex-col">
                    <span className="text-base">{p.name}</span>
                    {p.brand && <span className="text-xs text-slate-500">{p.brand}</span>}
                  </div>
                </td>
                <td className="p-4 font-mono text-slate-400">{p.masterSku}</td>
                <td className="p-4">
                  <span className={`font-bold ${p.totalAvailable > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {p.totalAvailable}
                  </span>
                </td>
                <td className="p-4">
                  <ChannelBadges channels={p.channels} />
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openStockModal(p)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
                  >
                    + Add Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE VIEW: Cards (Hidden on Desktop) */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((p) => (
          <div 
            key={p._id} 
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4"
          >
            {/* Header: Name & SKU */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-100 leading-tight mb-1">{p.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {p.masterSku}
                  </span>
                  {p.brand && <span>{p.brand}</span>}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Available Stock */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Boxes size={12} /> Available
                </span>
                <span className={`text-xl font-bold ${p.totalAvailable > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {p.totalAvailable}
                </span>
              </div>

              {/* Channels */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Layers size={12} /> Channels
                </span>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  <ChannelBadges channels={p.channels} small />
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => openStockModal(p)}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={14} /> Manage Stock
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* Helper: Channel Badges */
function ChannelBadges({ channels, small }) {
  if (!channels) return <span className="text-slate-600 text-xs italic">No channels</span>;

  const activeChannels = [];
  if (channels.shopify?.sku) activeChannels.push("Shopify");
  if (channels.amazon?.sku) activeChannels.push("Amazon");
  if (channels.walmart?.sku) activeChannels.push("Walmart");

  if (activeChannels.length === 0) {
    return <span className="text-slate-600 text-xs italic">No channels</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {activeChannels.map((c) => (
        <span 
          key={c} 
          className={`
            ${small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"}
            rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 flex items-center gap-1
          `}
        >
          {c === "Shopify" && <ShoppingBag size={small ? 10 : 12} />}
          {c}
        </span>
      ))}
    </div>
  );
}