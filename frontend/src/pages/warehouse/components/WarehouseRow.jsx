export default function WarehouseRow({ warehouse, onClick }) {
  return (
    <tr
      onClick={onClick}
      className="border-t border-slate-800 hover:bg-slate-800/50 cursor-pointer"
    >
      <td className="p-3 font-medium">{warehouse.name}</td>

      <td className="p-3 text-center">
        {warehouse.is_default ? (
          <span className="px-2 py-1 rounded text-xs bg-green-600/30 text-green-300">
            DEFAULT
          </span>
        ) : (
          <span className="text-slate-500">—</span>
        )}
      </td>

      <td className="p-3">
        {warehouse.origin_address?.city_locality}
      </td>

      <td className="p-3">
        {warehouse.origin_address?.country_code}
      </td>

      <td className="p-3">
        {warehouse.origin_address?.phone}
      </td>

      <td className="p-3">
        {new Date(warehouse.created_at).toLocaleDateString()}
      </td>
    </tr>
  );
}
