export default function StatsBar({ products }) {
  const totalStock = products.reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const lowStock = products.filter((p) => p.totalStock <= 5).length;

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">

      <Card title="Products" value={products.length} />
      <Card title="Total Units" value={totalStock} />
      <Card title="Low Stock" value={lowStock} color="text-red-400" />
      <Card title="Connected Stores" value="4" />

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-bold ${color || "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
