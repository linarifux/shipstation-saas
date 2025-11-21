export default function FeatureGrid() {
  const features = [
    {
      title: "Custom Field Engine",
      desc: "Map SKU, store, product, or note data directly into ShipStation custom fields.",
    },
    {
      title: "Rule-Based Workflows",
      desc: "Trigger smart automation based on weight, destination, SKU, tags, and more.",
    },
    {
      title: "Full Observability",
      desc: "Dry-runs, logs, rollback safety, and visibility into all automation changes.",
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold md:text-2xl">Powerful Automation Features</h2>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-800 bg-slate-950 p-5 hover:border-cyan-500/50 transition"
          >
            <h3 className="text-sm font-semibold text-slate-50">{f.title}</h3>
            <p className="mt-2 text-xs text-slate-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
