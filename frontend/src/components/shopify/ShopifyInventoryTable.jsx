import ShopifyInventoryRow from "./ShopifyInventoryRow";
import { getMasterMatch } from "../../utils/getMasterMatch";

export default function ShopifyInventoryTable({
  products,
  masterProducts,
  locations,
  onUpdate,
  onSync
}) {
  if (products.length === 0) {
    return <p className="text-slate-400 mt-6">No Shopify inventory found.</p>;
  }

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Location</th>
            <th className="p-3">Shopify Qty</th>
            <th className="p-3">Master Status</th>
            <th className="p-3">New Qty</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) =>
            item.levels.map((lvl) => {
              const master = getMasterMatch(masterProducts, item.sku);

              return (
                <ShopifyInventoryRow
                  key={item.sku + lvl.location_id}
                  product={item}
                  level={lvl}
                  locationName={locations[lvl.location_id]}
                  master={master}
                  onUpdate={onUpdate}
                  onSync={() => onSync(master)}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
