export default function ItemsList({ items }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <h3 className="text-sm text-slate-300 mb-3 font-semibold">
        Items ({items?.length || 0})
      </h3>

      {items?.length === 0 && (
        <p className="text-slate-400 text-sm">No items in shipment.</p>
      )}

      <div className="space-y-3">
        {items?.map((item) => (
          <div
            key={item.item_id}
            className="bg-slate-900 border border-slate-700 rounded p-3"
          >
            <p className="text-slate-100 font-medium">{item.name}</p>
            <p className="text-xs text-slate-400">
              Qty: {item.quantity} · Price: ${item.unit_price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
