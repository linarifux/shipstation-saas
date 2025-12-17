import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Toaster } from 'react-hot-toast';
import Footer from '../Footer.jsx'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">

      {/* SIDEBAR */}
      <div
        className={`hidden md:block transition-all duration-300 
          ${sidebarOpen ? "w-64" : "w-20"} 
          bg-slate-900 border-r border-slate-800`}
      >
        <Sidebar
          collapsed={!sidebarOpen}
          toggle={() => setSidebarOpen((prev) => !prev)}
        />
      </div>

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar
            collapsed={false}
            toggle={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen">

        <Topbar toggleSidebar={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />   {/* THIS MUST EXIST */}
          </div>
        </main>

         <Footer />

      </div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#334155', // matches slate-700
            color: '#fff',
          },
        }}
      />

    </div>
  );
}
