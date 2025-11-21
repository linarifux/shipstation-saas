import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          ShipStation App
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link className="hover:text-blue-400" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-blue-400" to="/shipments">Shipments</Link>
          <Link className="hover:text-blue-400" to="/orders">Orders</Link>
          <Link className="hover:text-blue-400" to="/automation">Automation</Link>
          <Link className="hover:text-blue-400" to="/settings">Settings</Link>
          <Link className="hover:text-blue-400" to="/settings">Warehouse</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-3 space-y-2 bg-gray-800 rounded-lg p-4">
          <Link
            className="block py-2 px-2 hover:bg-gray-700 rounded"
            to="/shipments"
            onClick={() => setOpen(false)}
          >
            Shipments
          </Link>

          <Link
            className="block py-2 px-2 hover:bg-gray-700 rounded"
            to="/orders"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>

          <Link
            className="block py-2 px-2 hover:bg-gray-700 rounded"
            to="/automation"
            onClick={() => setOpen(false)}
          >
            Automation
          </Link>

          <Link
            className="block py-2 px-2 hover:bg-gray-700 rounded"
            to="/settings"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
}
