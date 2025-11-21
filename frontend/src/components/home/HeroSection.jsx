import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 shadow-sm shadow-slate-900/70 backdrop-blur">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>Built for ShipStation power users</span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold md:text-5xl lg:text-6xl">
          Automate. Optimize.
          <span className="block bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Ship Smarter.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-sm text-slate-300 md:text-base">
          The automation layer ShipStation never built—custom fields, workflows,
          rules, dashboards, all API-powered and blazing fast.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/shipments"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400"
          >
            Open Dashboard →
          </Link>

          <Link
            to="/automation"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600/70 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-400"
          >
            Configure Automation
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
