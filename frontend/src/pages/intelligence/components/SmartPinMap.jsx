import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker
} from "react-leaflet";

/**
 * TEMP static city → coords map
 * (Next step: we’ll replace this with auto-geocoding)
 */
const cityCoords = {
  "London, GB": [51.5074, -0.1278],
  "Manchester, GB": [53.48, -2.24],
  "Birmingham, GB": [52.48, -1.9],
  "Paris, FR": [48.8566, 2.3522],
  "Berlin, DE": [52.52, 13.405]
};

export default function SmartPinMap({ cities = [], warehouses = [], bestLocation }) {
  const defaultCenter = [51.5, -0.1]; // UK center

  const getCoords = (city, country) =>
    cityCoords[`${city}, ${country}`] || null;

  const normalizeRadius = (orders) => {
    if (!orders) return 6;
    const r = Math.sqrt(orders) * 4;   // smooth scaling
    return Math.min(Math.max(r, 6), 30);
  };

  const recommendedCoords =
    bestLocation && getCoords(bestLocation.city, bestLocation.country);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <MapContainer
        center={recommendedCoords || defaultCenter}
        zoom={5}
        className="h-[520px] w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔵 Customer Order Locations */}
        {cities.slice(0, 20).map((c) => {
          const coords = getCoords(c.city, c.country);
          if (!coords) return null;

          return (
            <CircleMarker
              key={`${c.city}-${c.country}`}
              center={coords}
              radius={normalizeRadius(c.orders)}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <strong>
                  {c.city}, {c.country}
                </strong>
                <br />
                Orders: {c.orders}
              </Popup>
            </CircleMarker>
          );
        })}

        {/* 🟢 Current Warehouses */}
        {warehouses.map((w) => {
          const { city_locality, country_code } = w.origin_address || {};
          const coords = getCoords(city_locality, country_code);
          if (!coords) return null;

          return (
            <Marker key={w.warehouse_id} position={coords}>
              <Popup>
                <strong>{w.name}</strong>
                <br />
                Current warehouse
                <br />
                {city_locality}, {country_code}
              </Popup>
            </Marker>
          );
        })}

        {/* 🔴 Recommended New Warehouse */}
        {bestLocation && recommendedCoords && (
          <Circle
            center={recommendedCoords}
            radius={50000} // 50 km suggestion radius
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.2
            }}
          >
            <Popup>
              <strong>Recommended New Warehouse</strong>
              <br />
              {bestLocation.city}, {bestLocation.country}
              <br />📦 Highest order concentration
              <br />🚚 Faster delivery potential
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
}
