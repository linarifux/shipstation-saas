import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ShipmentsByCountryChart() {
  // Replace with real API data
  const data = [
    { country: "United States", shipments: 540 },
    { country: "United Kingdom", shipments: 320 },
    { country: "Canada", shipments: 210 },
    { country: "Australia", shipments: 180 },
    { country: "Germany", shipments: 140 },
    { country: "France", shipments: 120 },
    { country: "Italy", shipments: 95 },
    { country: "Netherlands", shipments: 82 },
    { country: "Spain", shipments: 75 },
    { country: "Singapore", shipments: 60 },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Shipments by Country
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <XAxis
            type="number"
            stroke="#64748b"
          />
          <YAxis
            type="category"
            dataKey="country"
            stroke="#64748b"
            width={150}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />

          <Bar
            dataKey="shipments"
            barSize={16}
            radius={[0, 6, 6, 0]}
            fill="#06b6d4"
            name="Shipments"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
