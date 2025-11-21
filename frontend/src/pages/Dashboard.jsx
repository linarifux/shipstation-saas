import DashboardLayout from "../components/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-5">Dashboard Overview</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Shipments" value="1,482" />
        <StatCard title="Automations Triggered" value="392" />
        <StatCard title="Active Rules" value="12" />
      </div>

      {/* More dashboard widgets can go here */}
    </DashboardLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}
