import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ComposedChart,
  CartesianGrid,
} from "recharts";

export default function CarrierCostChart() {
  // Sample Data – Replace with real carrier cost data from ShipStation
  const data = [
    {
      carrier: "UPS",
      avgCost: 12.5,
      totalCost: 4200,
      costPerLb: 1.9,
    },
    {
      carrier: "USPS",
      avgCost: 8.3,
      totalCost: 3100,
      costPerLb: 1.1,
    },
    {
      carrier: "FedEx",
      avgCost: 14.8,
      totalCost: 3900,
      costPerLb: 2.3,
    },
    {
      carrier: "DHL",
      avgCost: 21.2,
      totalCost: 2800,
      costPerLb: 3.4,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Carrier Cost Comparison
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

          <XAxis dataKey="carrier" stroke="#64748b" />
          <YAxis yAxisId="left" stroke="#64748b" />
          <YAxis yAxisId="right" orientation="right" stroke="#64748b" />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ color: "#94a3b8" }} />

          {/* Bar: Average Cost */}
          <Bar
            yAxisId="left"
            dataKey="avgCost"
            name="Avg Cost ($)"
            fill="#06b6d4"
            radius={[4, 4, 0, 0]}
          />

          {/* Bar: Total Cost */}
          <Bar
            yAxisId="left"
            dataKey="totalCost"
            name="Total Cost ($)"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
          />

          {/* Line: Cost per lb */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="costPerLb"
            name="Cost per lb ($)"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
