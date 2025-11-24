export default function RecommendBox({ location }) {
  if (!location) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="font-semibold mb-4">
        ✅ Recommended New Warehouse
      </h2>

      <p className="text-xl font-bold text-green-400">
        {location.city}, {location.country}
      </p>

      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        <li>📦 Highest order concentration</li>
        <li>🚚 Faster average delivery</li>
        <li>💰 Lower shipping cost</li>
        <li>✅ Covers majority of customers</li>
      </ul>
    </div>
  );
}
