import { ChevronDown, ChevronRight } from "lucide-react";
import ChannelLocations from "./ChannelLocations";
import ProductLocations from "./ProductLocations";

export default function MasterProductRow({
  product,
  expanded,
  onToggle,
  refresh,
  onAddStock,
}) {

  const channels = product.channels || {};

  return (
    <>
      <tr className="border-t border-slate-800 hover:bg-slate-800/40">
        {/* EXPAND */}
        <td className="p-3 w-8">
          <button onClick={onToggle} className="text-slate-400 hover:text-white">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        </td>

        {/* PRODUCT */}
        <td className="p-3">
          <div className="font-medium">{product.name}</div>
          <div className="text-xs text-slate-400">{product.brand}</div>
        </td>

        {/* SKU */}
        <td className="p-3 font-mono text-xs">{product.masterSku}</td>

        {/* TOTAL MASTER STOCK */}
        <td className="p-3 font-bold text-cyan-400">
          {product?.totalAvailable}
        </td>

        {/* ✅ CONNECTED CHANNELS */}
        <td className="p-3 space-y-3">

          {/* NO CHANNELS */}
          {!channels?.shopify &&
           !channels?.amazon &&
           !channels?.walmart &&
           !channels?.shipstation && (
            <span className="text-slate-500 text-sm">
              No channels connected
            </span>
          )}

          {/* SHOPIFY */}
          {channels?.shopify && (
            <div className="space-y-1">
              <span className="inline-block px-2 py-1 text-xs rounded bg-indigo-700/30 text-indigo-300 border border-indigo-500">
                Shopify
              </span>
            </div>
          )}

          {/* AMAZON */}
          {channels?.amazon && (
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded bg-orange-700/30 text-orange-300 border border-orange-500">
                Amazon
              </span>
            </div>
          )}

          {/* WALMART */}
          {channels?.walmart && (
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded bg-blue-700/30 text-blue-300 border border-blue-500">
                Walmart
              </span>
            </div>
          )}

          {/* SHIPSTATION */}
          {channels?.shipstation && (
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded bg-slate-700/30 text-slate-300 border border-slate-500">
                ShipStation
              </span>
            </div>
          )}

        </td>
      </tr>

      {/* ✅ EXPANDED: WAREHOUSE CONTROL */}
      {expanded && (
        <tr className="bg-slate-950/80">
          <td colSpan={5} className="p-4">
            <ProductLocations
              product={product}
              refresh={refresh}
              onAddStock={onAddStock}
            />
          </td>
        </tr>
      )}
    </>
  );
}
