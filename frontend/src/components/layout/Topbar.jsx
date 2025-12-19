import { useLocation, Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { Menu, Sun, Plus } from "lucide-react";

// Page Title Map
const pageTitles = {
  "/dashboard": "Dashboard",
  "/shipments": "Shipments",
  "/shopify-orders": "Shopify Orders",
  "/inventory": "Inventory",
  "/warehouses": "Warehouses",
  "/products": "Products",
  "/automation": "Automation",
  "/analytics": "Analytics",
  "/users": "Users",
  "/billing": "Billing",
  "/logs": "Logs",
};

export default function Topbar({ toggleSidebar }) {
  const { pathname } = useLocation();

  const pageTitle = pageTitles[pathname] || "Welcome";

  // Breadcrumb generator
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((crumb) => crumb.charAt(0).toUpperCase() + crumb.slice(1));

  return (
    <header
      className="
        w-full h-16 
        backdrop-blur-xl 
        bg-slate-900/80 
        border-b border-slate-800 
        flex items-center justify-between 
        px-4 md:px-6 
        sticky top-0 z-50
      "
    >
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-4">

        {/* Sidebar Toggle (Mobile) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-300 hover:text-white transition"
        >
          <Menu size={22} />
        </button>

        {/* Title + Breadcrumbs */}
        <div className="hidden sm:flex flex-col">
          <h1 className="text-white font-semibold text-lg leading-tight">
            {pageTitle}
          </h1>
          <div className="text-xs text-slate-400">
            <Link to="/dashboard" className="hover:text-cyan-400">
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i}> / {crumb}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-5 text-slate-300">

      

        {/* Notification Bell */}
        <button
          className="
            relative hover:text-white transition 
            flex items-center justify-center
          "
        >
          <span className="text-xl">🔔</span>
          <span
            className="
              absolute top-0 right-0 
              h-2.5 w-2.5 
              bg-red-500 
              rounded-full 
              border border-slate-900
            "
          ></span>
        </button>

        {/* Dark / Light (Future-ready) */}
        <button className="hover:text-white transition">
          <Sun size={18} />
        </button>

        {/* Profile Menu */}
        <ProfileMenu />
      </div>
    </header>
  );
}
