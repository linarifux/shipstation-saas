import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";

import WarehouseTable from "./components/WarehouseTable";
import WarehouseDrawer from "./components/WarehouseDrawer";
import WarehousesToolbar from "./components/WarehousesToolbar";
import EmptyState from "./components/EmptyState";
import AddWarehouseModal from "./components/AddWarehouseModal";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:5000/api/warehouses"); // ✅ FIXED ENDPOINT

      setWarehouses(res.data?.warehouses || []);
    } catch (err) {
      console.error("Error fetching warehouses", err);
      setError("Failed to load warehouses. Check database or server.");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filtered = warehouses.filter((w) =>
    w?.name?.toLowerCase().includes(search.toLowerCase()) ||
    w?.address?.city?.toLowerCase().includes(search.toLowerCase()) ||
    w?.address?.country?.toLowerCase().includes(search.toLowerCase())
  );

  const openDrawer = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDrawerOpen(true);
  };

  /* ✅ SHOW SPINNER */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <HashLoader size={50} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-6 text-slate-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">🏢 Warehouses</h1>

        <div className="flex gap-3">
          <button
            onClick={fetchWarehouses}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow"
          >
            Refresh
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow"
          >
            + Add Warehouse
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <WarehousesToolbar search={search} setSearch={setSearch} />

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* CONTENT */}
      {filtered.length === 0 ? (
        <EmptyState isLoading={loading} />
      ) : (
        <WarehouseTable
          warehouses={filtered}
          onSelect={openDrawer}
        />
      )}

      {/* DRAWER */}
      <WarehouseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        warehouse={selectedWarehouse}
      />

      {/* ADD MODAL */}
      <AddWarehouseModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={fetchWarehouses}
      />
    </div>
  );
}
