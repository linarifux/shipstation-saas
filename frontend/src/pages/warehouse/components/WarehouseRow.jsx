export default function WarehouseRow({ warehouse, onClick }) {
  const address = warehouse.address || {};

  return (
    <tr
      onClick={onClick}
      className="border-t border-slate-800 hover:bg-slate-800/40 cursor-pointer transition"
    >
      {/* NAME */}
      <td className="p-3 font-medium">
        {warehouse.name}
      </td>

      {/* DEFAULT */}
      <td className="p-3 text-center">
        {warehouse.isDefault ? (
          <span className="px-2 py-1 rounded-full text-xs bg-emerald-600/20 text-emerald-400">
            Yes
          </span>
        ) : (
          <span className="text-slate-600 text-xs">No</span>
        )}
      </td>

      {/* CITY */}
      <td className="p-3">
        {address.city || "-"}
      </td>

      {/* COUNTRY */}
      <td className="p-3">
        {address.country || "-"}
      </td>

      {/* CODE */}
      <td className="p-3 font-mono text-xs">
        {warehouse.code || "-"}
      </td>

      {/* CREATED */}
      <td className="p-3 text-slate-500 text-xs">
        {new Date(warehouse.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}
