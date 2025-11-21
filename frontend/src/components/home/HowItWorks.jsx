export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Connect ShipStation",
      desc: "Secure API-based connection with no plain-text credential storage.",
    },
    {
      step: "02",
      title: "Define Automation",
      desc: "Create rules that auto-apply fields, logic, and workflows.",
    },
    {
      step: "03",
      title: "Run Automatically",
      desc: "Background workers sync shipments and apply automation in real time.",
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold md:text-2xl">How It Works</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.step} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <div className="text-cyan-300 text-xs font-semibold">{s.step}</div>
            <h3 className="mt-2 text-sm font-semibold">{s.title}</h3>
            <p className="mt-2 text-xs text-slate-300">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
