import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ collapsed, toggle }) {
  const { pathname } = useLocation();

  const menu = [
    { label: "Shipments", to: "/shipments", icon: "🚚" },
    { label: "Automation", to: "/automation", icon: "⚙️" },
    { label: "Analytics", to: "/analytics", icon: "📈" },
    { label: "Shopify Orders", to: "/shopify-orders", icon: "🛒" },
    { label: "Shopify Inventory", to: "/inventory", icon: "📦" },
  ];

  return (
    <div
      className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white tracking-wide">
            ShipFlow
          </h1>
        )}

        <button
          onClick={toggle}
          className="text-slate-400 hover:text-white transition text-lg"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-5 px-3 space-y-1">
        {menu.map((m) => {
          const active = pathname === m.to;

          return (
            <div key={m.to} className="relative group">
              <Link
                to={m.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                ${
                  active
                    ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span className="text-xl">{m.icon}</span>

                {/* Hide label in collapsed mode */}
                {!collapsed && (
                  <span className="whitespace-nowrap">{m.label}</span>
                )}
              </Link>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className="absolute left-14 top-1/2 -translate-y-1/2 
                    bg-slate-800 text-slate-100 text-xs px-3 py-1 rounded-md 
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    shadow-lg border border-slate-700 
                    transition-all duration-200 whitespace-nowrap"
                >
                  {m.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-slate-800 text-xs text-slate-500">
        {!collapsed && <p>v1.0.0 • ShipFlow</p>}
      </div>
    </div>
  );
}
