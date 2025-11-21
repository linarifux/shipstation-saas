import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">

      {/* SIDEBAR */}
      <div
        className={`transition-all duration-300 
          ${sidebarOpen ? "w-64" : "w-20"} 
          hidden md:block bg-slate-900 border-r border-slate-800`}
      >
        <Sidebar collapsed={!sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
        )}
        <div
          className={`fixed top-0 left-0 z-50 h-full bg-slate-900 border-r border-slate-800 w-64 transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar collapsed={false} toggle={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* TOPBAR */}
        <div className="sticky top-0 z-30 shadow-md shadow-slate-900/50 bg-slate-900 border-b border-slate-800">
          <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
