import { useState } from "react";
import { Boxes, Edit, Layers, ShoppingBag, Link2, MapPin, ChevronDown, ChevronUp, Warehouse } from "lucide-react";

export default function MasterProductsTable({ products, refresh, openStockModal }) {
  // State to track expanded rows
  const [expandedRows, setExpandedRows] = useState(new Set());

  if (!products || products.length === 0) return null;

  const toggleRow = (id) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  return (
    <>
      {/* 🖥️ DESKTOP VIEW */}
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
            {products.map((p) => {
              const isExpanded = expandedRows.has(p._id);
              // Check if we have ANY location data (Internal OR Shopify)
              const hasInternal = p.locations && p.locations.length > 0;
              const hasShopify = p.shopifyLevels && p.shopifyLevels.length > 0;
              const hasAnyStock = hasInternal || hasShopify;

              return (
                <div key={p._id} style={{ display: "contents" }}>
                  <tr 
                    className={`border-t border-slate-800 transition-colors ${isExpanded ? "bg-slate-800/30" : "hover:bg-slate-800/50"}`}
                  >
                    <td className="p-4 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="text-base">{p.name}</span>
                        {p.brand && <span className="text-xs text-slate-500">{p.brand}</span>}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{p.masterSku}</td>
                    
                    {/* AVAILABLE STOCK TOGGLE */}
                    <td className="p-4">
                      <button 
                        onClick={() => hasAnyStock && toggleRow(p._id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all
                          ${p.totalAvailable > 0 ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" : "text-red-400 bg-red-500/10"}
                          ${!hasAnyStock ? "cursor-default opacity-80" : "cursor-pointer border border-transparent hover:border-emerald-500/30"}
                        `}
                      >
                        <span className="font-bold">{p.totalAvailable}</span>
                        {hasAnyStock && (
                          isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </button>
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

                  {/* 🔽 EXPANDED DETAILS ROW (Desktop) */}
                  {isExpanded && (
                    <tr className="bg-slate-900/50 border-t border-slate-800/50">
                      <td colSpan="5" className="p-0">
                        <div className="p-4 bg-slate-950/30 border-b border-slate-800 shadow-inner flex gap-8">
                          
                          {/* 1. Internal Warehouses */}
                          {hasInternal && (
                            <div className="flex-1">
                              <p className="text-xs uppercase text-slate-500 font-bold mb-2 flex items-center gap-2">
                                <Warehouse size={12} /> Internal Warehouses
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {p.locations.map((loc, idx) => (
                                  <div key={idx} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 flex flex-col min-w-[100px]">
                                    <span className="text-slate-400 text-xs font-medium mb-1 truncate">
                                      {loc.warehouse?.name || "Unknown"}
                                    </span>
                                    <span className="text-emerald-400 font-mono font-bold text-lg">
                                      {loc.available}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 2. Channel Locations (Shopify, etc.) */}
                          {hasShopify && (
                            <div className="flex-1 border-l border-slate-800 pl-8">
                              <p className="text-xs uppercase text-slate-500 font-bold mb-2 flex items-center gap-2">
                                <ShoppingBag size={12} /> Shopify Locations
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {p.shopifyLevels.map((lvl, idx) => (
                                  <div key={idx} className="bg-indigo-900/10 border border-indigo-500/20 rounded px-3 py-2 flex flex-col min-w-[100px] relative">
                                    <span className="text-indigo-300 text-xs font-medium mb-1 truncate pr-4">
                                      {lvl.location_name}
                                    </span>
                                    <span className="text-indigo-400 font-mono font-bold text-lg">
                                      {lvl.available}
                                    </span>
                                    {/* Show if it's a duplicate (synced) location */}
                                    {lvl.isDuplicate && (
                                       <span title="Synced with internal warehouse" className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </td>
                    </tr>
                  )}
                </div>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE VIEW */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((p) => {
          const isExpanded = expandedRows.has(p._id);
          const hasInternal = p.locations && p.locations.length > 0;
          const hasShopify = p.shopifyLevels && p.shopifyLevels.length > 0;
          const hasAnyStock = hasInternal || hasShopify;

          return (
            <div 
              key={p._id} 
              className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4 transition-all ${isExpanded ? "ring-1 ring-cyan-500/30" : ""}`}
            >
              {/* Header */}
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
                <button 
                  onClick={() => hasAnyStock && toggleRow(p._id)}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all
                    ${hasAnyStock ? "cursor-pointer hover:bg-slate-800" : "cursor-default opacity-90"}
                    ${isExpanded ? "bg-slate-800 border-cyan-500/30" : "bg-slate-950/50 border-slate-800"}
                  `}
                >
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                    <Boxes size={12} /> Available
                    {hasAnyStock && (isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
                  </span>
                  <span className={`text-xl font-bold ${p.totalAvailable > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {p.totalAvailable}
                  </span>
                </button>

                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                    <Layers size={12} /> Channels
                  </span>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    <ChannelBadges channels={p.channels} small />
                  </div>
                </div>
              </div>

              {/* 🔽 EXPANDED LOCATION DETAILS (Mobile) */}
              {isExpanded && (
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 animate-in slide-in-from-top-2 duration-200 space-y-4">
                  
                  {/* Internal Stock Mobile */}
                  {hasInternal && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1">
                        <Warehouse size={12} /> Internal Warehouses
                      </p>
                      <div className="space-y-1">
                        {p.locations.map((loc, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-800 last:border-0 pb-1 last:pb-0">
                            <span className="text-slate-300">{loc.warehouse?.name}</span>
                            <span className="font-mono text-emerald-400 font-bold">{loc.available}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shopify Stock Mobile */}
                  {hasShopify && (
                    <div>
                       <p className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1">
                        <ShoppingBag size={12} /> Shopify Locations
                      </p>
                      <div className="space-y-1">
                        {p.shopifyLevels.map((lvl, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-800 last:border-0 pb-1 last:pb-0">
                            <span className="text-indigo-300 flex items-center gap-1">
                               {lvl.location_name}
                               {lvl.isDuplicate && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" title="Synced"></span>}
                            </span>
                            <span className="font-mono text-indigo-400 font-bold">{lvl.available}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Actions */}
              <button
                onClick={() => openStockModal(p)}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={14} /> Manage Stock
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* Helper: Channel Badges */
function ChannelBadges({ channels, small }) {
  if (!channels) return <span className="text-slate-600 text-xs italic">No channels</span>;

  const activeChannels = [];
  if (channels.shopify?.sku) activeChannels.push("Shopify");
  if (channels.shipstation?.sku) activeChannels.push("ShipStation");
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
          {c === "ShipStation" && <Link2 size={small ? 10 : 12} />}
          {c}
        </span>
      ))}
    </div>
  );
}