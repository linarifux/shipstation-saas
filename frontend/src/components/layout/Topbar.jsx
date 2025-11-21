import ProfileMenu from "./ProfileMenu";
import { Menu } from "lucide-react"; // optional icon if you use lucide-react

export default function Topbar({ toggleSidebar }) {
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
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle - visible on mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-300 hover:text-white transition"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="hidden sm:block w-64">
          <input
            type="text"
            placeholder="Search…"
            className="
              w-full bg-slate-800/70 
              border border-slate-700 
              rounded-lg px-3 py-2 text-sm 
              text-slate-200
              placeholder-slate-400
              focus:outline-none focus:border-cyan-500 
              transition
            "
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
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

        {/* Lightning Quick Actions */}
        <button className="hover:text-white transition text-xl">⚡</button>

        {/* Profile Menu */}
        <ProfileMenu />
      </div>
    </header>
  );
}
