import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950" />

      <motion.div
        className="absolute -top-40 right-[-200px] h-96 w-96 rounded-full bg-linear-to-tr from-blue-500/40 via-cyan-400/40 to-emerald-400/40 blur-3xl"
        animate={{ y: [0, 25, 0], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-150px] left-[-100px] h-96 w-96 rounded-full bg-linear-to-tr from-purple-500/30 via-blue-500/30 to-cyan-400/30 blur-3xl"
        animate={{ y: [0, -20, 0], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
