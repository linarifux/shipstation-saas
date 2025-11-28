import { Store, Building2, Truck, Box } from "lucide-react";

export default function ChannelsBlocks({ product }) {

  return (
    <div className="flex flex-col gap-3">

      {/* ✅ SHOPIFY */}
      {product.channels?.shopify && (
        <div className="p-3 border border-green-700 rounded bg-green-900/10">

          <p className="text-green-400 font-semibold text-sm flex items-center gap-2 mb-1">
            <Store size={14} /> Shopify
          </p>

          {(product.shopifyLevels || []).length === 0 && (
            <p className="text-slate-500 text-xs">No locations found</p>
          )}

          {product.shopifyLevels?.map(level => (
            <div
              key={level.location_id}
              className="flex justify-between text-xs mt-1"
            >
              <span className="text-slate-400">
                📍 {level.location_name}
              </span>

              <span className="text-cyan-400 font-semibold">
                {level.available}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ✅ AMAZON */}
      {product.channels?.amazon && (
        <div className="p-3 border border-orange-700 rounded bg-orange-900/10">

          <p className="text-orange-400 font-semibold text-sm flex items-center gap-2">
            <Box size={14} /> Amazon
          </p>

          <p className="text-xs text-slate-400">
            ASIN: {product.channels.amazon.asin || product.channels.amazon.sku}
          </p>

          <p className="text-slate-500 text-xs mt-1">
            Location sync coming soon...
          </p>
        </div>
      )}

      {/* ✅ WALMART */}
      {product.channels?.walmart && (
        <div className="p-3 border border-blue-700 rounded bg-blue-900/10">

          <p className="text-blue-400 font-semibold text-sm flex items-center gap-2">
            <Building2 size={14} /> Walmart
          </p>

          <p className="text-xs text-slate-400">
            SKU: {product.channels.walmart.sku}
          </p>

          <p className="text-slate-500 text-xs mt-1">
            Location sync coming soon...
          </p>
        </div>
      )}

      {/* ✅ SHIPSTATION */}
      {product.channels?.shipstation && (
        <div className="p-3 border border-cyan-700 rounded bg-cyan-900/10">

          <p className="text-cyan-400 font-semibold text-sm flex items-center gap-2">
            <Truck size={14} /> ShipStation
          </p>

          <p className="text-xs text-slate-400">
            SKU: {product.channels.shipstation.sku}
          </p>
        </div>
      )}

    </div>
  );
}
