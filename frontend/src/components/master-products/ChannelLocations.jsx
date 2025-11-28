export default function ChannelLocations({ name, data, color = "indigo" }) {
  return (
    <div>
      <p className={`text-xs text-${color}-400 font-semibold mb-1`}>
        {name} Locations
      </p>

      <div className="flex flex-wrap gap-2">
        {data.map((loc) => (
          <span
            key={loc.location_id}
            className={`px-2 py-1 text-xs rounded border bg-${color}-950 border-${color}-700`}
          >
            {loc.location_name}:{" "}
            <span className={`text-${color}-400 font-semibold`}>
              {loc.available}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
