export default function ProductRow({ product, onClick }) {
  const low = product.totalStock <= 5;

  return (
    <tr
      onClick={onClick}
      className="border-t border-slate-800 hover:bg-slate-800/50 cursor-pointer"
    >
      <td className="p-3 flex items-center gap-3">
        <img
          src={product.image || "/placeholder.png"}
          className="w-10 h-10 rounded border border-slate-700 object-cover"
        />
        {product.name}
      </td>

      <td className="p-3">{product.sku}</td>

      <td className={`p-3 text-center font-bold ${low ? "text-red-400" : "text-green-400"}`}>
        {product.stock}
      </td>

      <td className="p-3 text-center">
        {product.channels?.length || 0}
      </td>

      <td className="p-3 text-center">
        <span className={`px-2 py-1 text-xs rounded 
          ${low ? "bg-red-600/30 text-red-300" : "bg-green-600/30 text-green-300"}`}>
          {low ? "Low Stock" : "Healthy"}
        </span>
      </td>
    </tr>
  );
}
