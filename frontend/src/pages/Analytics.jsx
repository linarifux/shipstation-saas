import DashboardLayout from "../components/layout/DashboardLayout";
import CarrierCostChart from "../components/charts/CarrierCostChart";
import ShipmentsByCountryChart from "../components/charts/ShipmentsByCountryChart";
import WorldHeatmap from "../components/charts/WorldHeatmap";


import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";

export default function Analytics() {
  // Sample data — replace with ShipStation API data later
  const dailyShipments = [
    { day: "Mon", count: 120 },
    { day: "Tue", count: 180 },
    { day: "Wed", count: 150 },
    { day: "Thu", count: 210 },
    { day: "Fri", count: 175 },
    { day: "Sat", count: 240 },
    { day: "Sun", count: 120 },
  ];

  const carrierData = [
    { name: "UPS", value: 340 },
    { name: "USPS", value: 420 },
    { name: "FedEx", value: 210 },
    { name: "DHL", value: 90 },
  ];

  const automationTriggers = [
    { rule: "Custom Field 1", triggers: 320 },
    { rule: "SKU-Based Rule", triggers: 190 },
    { rule: "EU Shipping Rule", triggers: 110 },
    { rule: "Heavy-Item Rule", triggers: 75 },
  ];

  const statusBreakdown = [
    { status: "Label Purchased", value: 540 },
    { status: "In Transit", value: 280 },
    { status: "Delivered", value: 690 },
    { status: "Exceptions", value: 40 },
  ];

  const COLORS = ["#06b6d4", "#2563eb", "#10b981", "#fbbf24"];

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Analytics Overview</h1>

      {/* KPI Row */}
      <div className="grid gap-6 md:grid-cols-4 mb-10">
        <KPI title="Total Shipments" value="2,550" />
        <KPI title="Delivered" value="1,930" />
        <KPI title="Pending" value="410" />
        <KPI title="Automation Triggers" value="780" />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-10 md:grid-cols-2">

        <CarrierCostChart />

        {/* LINE CHART: Shipment Volume */}
        <ChartCard title="Weekly Shipment Volume">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyShipments}>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PIE CHART: Carrier Split */}
        <ChartCard title="Shipments by Carrier">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={carrierData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
              >
                {carrierData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ShipmentsByCountryChart />

        <WorldHeatmap />


        {/* BAR CHART: Triggered Automations */}
        <ChartCard title="Automation Trigger Frequency">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={automationTriggers}>
              <XAxis dataKey="rule" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="triggers" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* DONUT CHART: Shipment Status */}
        <ChartCard title="Shipment Status Breakdown">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}

/* ------------------ Reusable Components ------------------ */

function KPI({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 shadow">
      <h3 className="text-sm font-semibold mb-4 text-slate-200">{title}</h3>
      {children}
    </div>
  );
}
