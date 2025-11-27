import { useState } from "react";
import { Link2, ArrowUpDown } from "lucide-react";

export default function ShopifyInventoryRow({
  product,
  level,
  locationName,
  master,
  onUpdate,
  onSync
}) {
  const [qty, setQty] = useState(level.available);

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-800/40">

      <td className="p-3 font-medium">{product.title}</td>

      <td className="p-3 text-xs font-mono">{product.sku}</td>

      <td className="p-3">
        {locationName || (
          <span className="text-slate-500">{level.location_id}</span>
        )}
      </td>

      <td className="p-3 font-bold text-cyan-400">
        {level.available}
      </td>

      <td className="p-3">
        {master ? (
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xs flex items-center gap-1">
              <Link2 size={12} /> {master.name}
            </span>

            <button
              onClick={onSync}
              className="bg-indigo-600 px-2 py-0.5 rounded text-xs flex gap-1 items-center"
            >
              <ArrowUpDown size={12} />
              Sync
            </button>
          </div>
        ) : (
          <span className="text-slate-500 text-xs">
            Not linked
          </span>
        )}
      </td>

      <td className="p-3">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded"
        />
      </td>

      <td className="p-3">
        <button
          onClick={() =>
            onUpdate(
              product.inventory_item_id,
              level.location_id,
              qty
            )
          }
          className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-sm"
        >
          Update
        </button>
      </td>
    </tr>
  );
}
