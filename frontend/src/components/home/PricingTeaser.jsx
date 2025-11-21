import { Link } from "react-router-dom";

export default function PricingTeaser() {
  return (
    <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-950 px-6 py-8">
      <h2 className="text-xl font-semibold md:text-2xl">
        Start simple — scale infinitely.
      </h2>

      <p className="mt-3 text-sm text-slate-300 max-w-xl">
        From small teams to 3PL warehouses, automate your shipping workflows with
        powerful, API-driven logic.
      </p>

      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4">
        <p className="text-slate-300">
          Starting at <span className="text-cyan-400 font-semibold">$19/mo</span>
        </p>

        <Link
          to="/settings"
          className="mt-3 inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-900"
        >
          View Setup Options
        </Link>
      </div>
    </section>
  );
}
