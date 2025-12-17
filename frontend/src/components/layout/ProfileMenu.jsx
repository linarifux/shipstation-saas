import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react"; // Optional icons for better UI

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 transition-opacity hover:opacity-80 focus:outline-none"
      >
        <img
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=ShipFlow`}
          className="h-8 w-8 md:h-9 md:w-9 rounded-full border border-slate-700 bg-slate-800"
          alt="Profile"
        />
      </button>

      {open && (
        <div 
          className="absolute right-0 mt-3 w-56 origin-top-right bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Mobile Label (Optional: shows email/name on mobile only if hidden in topbar) */}
          <div className="px-4 py-3 border-b border-slate-800 mb-1 md:hidden">
            <p className="text-sm font-semibold text-white">Naimul Islam</p>
            <p className="text-xs text-slate-400">user@example.com</p>
          </div>

          <button 
            className="w-full text-left px-4 py-3 md:py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <User size={16} />
            My Profile
          </button>
          
          <button 
            className="w-full text-left px-4 py-3 md:py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <Settings size={16} />
            Settings
          </button>
          
          <div className="h-px bg-slate-800 my-1 mx-2"></div>
          
          <button 
            className="w-full text-left px-4 py-3 md:py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}