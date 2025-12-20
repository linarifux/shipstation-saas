import { useState } from "react";
import { Boxes, Edit, Layers, ShoppingBag, Link2, ChevronDown, ChevronUp, Warehouse, Trash2 } from "lucide-react";

// ✅ Added onDelete prop
export default function MasterProductsTable({ products, openStockModal, onDelete }) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  if (!products || products.length === 0) return null;

  const toggleRow = (id) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  // ✅ Helper to confirm before deleting
  const handleDeleteClick = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      onDelete(product._id);
    }
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
              const validInternalLocations = (p.locations || []).filter(l => l.warehouse);
              const hasInternal = validInternalLocations.length > 0;
              const hasShopify = p.shopifyLevels && p.shopifyLevels.length > 0;
              const hasAnyStock = hasInternal || hasShopify;

              return (
                <div key={p._id} style={{ display: "contents" }}>
                  <tr className={`border-t border-slate-800 transition-colors ${isExpanded ? "bg-slate-800/30" : "hover:bg-slate-800/50"}`}>
                    <td className="p-4 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="text-base">{p.name}</span>
                        {p.brand && <span className="text-xs text-slate-500">{p.brand}</span>}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{p.masterSku}</td>
                    
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
                    
                    {/* ✅ UPDATED ACTIONS COLUMN */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openStockModal(p)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
                        >
                          + Add Stock
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(p)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED DETAILS (Unchanged logic, just keeping structure) */}
                  {isExpanded && (
                    <tr className="bg-slate-900/50 border-t border-slate-800/50">
                      <td colSpan="5" className="p-0">
                        <div className="p-4 bg-slate-950/30 border-b border-slate-800 shadow-inner flex gap-8 animate-in slide-in-from-top-1 duration-200">
                          {hasInternal && (
                            <div className="flex-1">
                              <p className="text-xs uppercase text-slate-500 font-bold mb-2 flex items-center gap-2">
                                <Warehouse size={12} /> Internal Warehouses
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {validInternalLocations.map((loc, idx) => (
                                  <div key={idx} className="bg-slate-800 border border-slate-700 rounded px-3 py-2 flex flex-col min-w-[100px]">
                                    <span className="text-slate-400 text-xs font-medium mb-1 truncate max-w-[120px]" title={loc.warehouse?.name}>
                                      {loc.warehouse?.name}
                                    </span>
                                    <span className="text-emerald-400 font-mono font-bold text-lg">
                                      {loc.available}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasShopify && (
                            <div className={`flex-1 ${hasInternal ? "border-l border-slate-800 pl-8" : ""}`}>
                              <p className="text-xs uppercase text-slate-500 font-bold mb-2 flex items-center gap-2">
                                <ShoppingBag size={12} /> Shopify Locations
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {p.shopifyLevels.map((lvl, idx) => (
                                  <div key={idx} className="bg-indigo-900/10 border border-indigo-500/20 rounded px-3 py-2 flex flex-col min-w-[100px] relative">
                                    <span className="text-indigo-300 text-xs font-medium mb-1 truncate max-w-[120px]" title={lvl.location_name}>
                                      {lvl.location_name}
                                    </span>
                                    <span className="text-indigo-400 font-mono font-bold text-lg">{lvl.available}</span>
                                    {lvl.isDuplicate && <span title="Synced" className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>}
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
          const validInternalLocations = (p.locations || []).filter(l => l.warehouse);
          const hasInternal = validInternalLocations.length > 0;
          const hasShopify = p.shopifyLevels && p.shopifyLevels.length > 0;
          const hasAnyStock = hasInternal || hasShopify;

          return (
            <div key={p._id} className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4 transition-all ${isExpanded ? "ring-1 ring-cyan-500/30" : ""}`}>
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 leading-tight mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{p.masterSku}</span>
                    {p.brand && <span>{p.brand}</span>}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => hasAnyStock && toggleRow(p._id)}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${hasAnyStock ? "cursor-pointer hover:bg-slate-800" : "cursor-default opacity-90"} ${isExpanded ? "bg-slate-800 border-cyan-500/30" : "bg-slate-950/50 border-slate-800"}`}
                >
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                    <Boxes size={12} /> Available
                    {hasAnyStock && (isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
                  </span>
                  <span className={`text-xl font-bold ${p.totalAvailable > 0 ? "text-emerald-400" : "text-red-400"}`}>{p.totalAvailable}</span>
                </button>

                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1"><Layers size={12} /> Channels</span>
                  <div className="flex flex-wrap justify-center gap-1 mt-1"><ChannelBadges channels={p.channels} small /></div>
                </div>
              </div>

              {/* Expanded Mobile Details (Hidden for brevity, logic same as previous) */}
              {isExpanded && (
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 space-y-4">
                   {hasInternal && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1"><Warehouse size={12} /> Internal Warehouses</p>
                      <div className="space-y-1">{validInternalLocations.map((loc, idx) => (<div key={idx} className="flex justify-between text-sm border-b border-slate-800 pb-1"><span className="text-slate-300">{loc.warehouse?.name}</span><span className="font-mono text-emerald-400 font-bold">{loc.available}</span></div>))}</div>
                    </div>
                  )}
                  {hasShopify && (
                    <div>
                       <p className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1"><ShoppingBag size={12} /> Shopify Locations</p>
                      <div className="space-y-1">{p.shopifyLevels.map((lvl, idx) => (<div key={idx} className="flex justify-between text-sm border-b border-slate-800 pb-1"><span className="text-indigo-300">{lvl.location_name}</span><span className="font-mono text-indigo-400 font-bold">{lvl.available}</span></div>))}</div>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ UPDATED MOBILE ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => openStockModal(p)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={14} /> Manage Stock
                </button>
                <button 
                  onClick={() => handleDeleteClick(p)}
                  className="px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ChannelBadges({ channels, small }) {
  if (!channels) return <span className="text-slate-600 text-xs italic">No channels</span>;
  const activeChannels = [];
  if (channels.shopify?.sku) activeChannels.push("Shopify");
  if (channels.shipstation?.sku) activeChannels.push("ShipStation");
  if (channels.amazon?.sku) activeChannels.push("Amazon");
  if (channels.walmart?.sku) activeChannels.push("Walmart");

  if (activeChannels.length === 0) return <span className="text-slate-600 text-xs italic">No channels</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {activeChannels.map((c) => (
        <span key={c} className={`${small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"} rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 flex items-center gap-1`}>
          {c === "Shopify" && <ShoppingBag size={small ? 10 : 12} />}
          {c === "ShipStation" && <Link2 size={small ? 10 : 12} />}
          {c}
        </span>
      ))}
    </div>
  );
}