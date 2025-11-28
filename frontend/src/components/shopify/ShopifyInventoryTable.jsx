import ShopifyInventoryRow from "./ShopifyInventoryRow";
import { getMasterMatch } from "../../utils/getMasterMatch";
import axios from "axios";

export default function ShopifyInventoryTable({
  products = [],
  masterProducts = [],
  locations = {},
  onUpdate,
  onSync,
  onLink,
  refresh,
}) {
  if (!products || products.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400">
        No Shopify inventory found.
      </div>
    );
  }

  /* ✅ UNLINK SHOPIFY FROM MASTER PRODUCT */
  async function unlinkShopify(masterId) {
    if (!masterId) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/master-products/${masterId}/unlink-shopify`
      );

      refresh && refresh();
    } catch (error) {
      console.error("Unlink failed", error);
      alert("Failed to unlink this product");
    }
  }

  return (
    <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
      <table className="w-full text-sm text-left">

        {/* HEADER */}
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
          {products.map((item, index) => {
            if (!item?.levels || item.levels.length === 0) return null;

            return item.levels.map((lvl) => {
              const master = getMasterMatch(masterProducts, item.sku);
              const locationName = locations
                ? locations[lvl.location_id]
                : null;

              return (
                <ShopifyInventoryRow
                  key={`${item.inventory_item_id}-${lvl.location_id}-${index}`}
                  product={item}
                  level={lvl}
                  locationName={locationName}
                  master={master}

                  onUpdate={onUpdate}

                  onSync={() => {
                    if (!master) return alert("No master product linked");
                    return onSync(master);
                  }}

                  onLink={() => onLink(item)}

                  onUnlink={() => {
                    if (!master?._id) return;
                    return unlinkShopify(master._id);
                  }}
                />
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
