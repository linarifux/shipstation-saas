export default function ProductFilters({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by product name or SKU..."
      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full mb-4 text-slate-200"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
