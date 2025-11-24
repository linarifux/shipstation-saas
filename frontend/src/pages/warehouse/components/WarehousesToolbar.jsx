export default function WarehousesToolbar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by warehouse name or city..."
      className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-full mb-4 text-slate-200"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
