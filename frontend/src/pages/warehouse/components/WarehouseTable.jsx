import WarehouseRow from "./WarehouseRow";

export default function WarehouseTable({ warehouses, onSelect }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-center">Default</th>
            <th className="p-3 text-left">City</th>
            <th className="p-3 text-left">Country</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((w) => (
            <WarehouseRow
              key={w._id}                 // ✅ FIXED
              warehouse={w}
              onClick={() => onSelect(w)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
