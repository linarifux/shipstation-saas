import { useState, useRef, useEffect } from "react";

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
        className="flex items-center gap-2 hover:text-white"
      >
        <img
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=ShipFlow`}
          className="h-8 w-8 rounded-full border border-slate-700"
          alt=""
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-lg py-2 text-sm">
          <button className="w-full text-left px-4 py-2 hover:bg-slate-800">
            My Profile
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-800">
            Settings
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-800 text-red-400">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
