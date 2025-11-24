export default function CityRanking({ cities }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="font-semibold mb-4">
        Top Order Locations
      </h2>

      {cities.slice(0, 6).map((c, i) => (
        <div key={i}
          className="flex justify-between py-2 border-b border-slate-800"
        >
          <span>
            {i + 1}. {c.city}, {c.country}
          </span>
          <span className="text-cyan-400 font-bold">
            {c.orders}
          </span>
        </div>
      ))}
    </div>
  );
}
