import React from "react";

export default function StatusBadge({ status }) {
  let styles = "bg-slate-700 text-slate-300 border-slate-600";
  
  if (status === "shipped" || status === "delivered") {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (status === "voided" || status === "cancelled") {
    styles = "bg-red-500/10 text-red-400 border-red-500/20";
  } else if (status === "label_created") {
    styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} uppercase tracking-wide`}>
      {status}
    </span>
  );
}