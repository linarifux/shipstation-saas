import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.1 }}
    >
      <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/80 backdrop-blur">
        
        {/* Window buttons */}
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
        </div>

        {/* Table mock */}
        <div className="rounded-xl border border-slate-800 bg-slate-950">
          <div className="border-b border-slate-800 px-4 py-2 text-xs text-slate-400">Shipments</div>

          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex justify-between px-4 py-3 border-b border-slate-800 text-xs">
              <div>
                <div className="text-slate-100 font-medium">#1000{i+1}</div>
                <div className="text-slate-500 text-[10px]">Destination</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">Label Purchased</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating automation banner */}
        <motion.div
          className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-xl border border-cyan-500/40 bg-slate-900 px-4 py-3 shadow-lg shadow-cyan-500/20"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <span className="block text-[11px] text-slate-300">
            Automation applied: Updated <strong>Custom Field 1</strong> on 3 shipments.
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
