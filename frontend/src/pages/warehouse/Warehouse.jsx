import { useEffect, useState } from "react";
import axios from "axios";

import WarehouseTable from "./components/WarehouseTable";
import WarehouseDrawer from "./components/WarehouseDrawer";
import WarehousesToolbar from "./components/WarehousesToolbar";
import EmptyState from "./components/EmptyState";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/warehouses");
      setWarehouses(res.data.warehouses);
    } catch (err) {
      console.error("Error fetching warehouses", err);
    }
    finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filtered = warehouses.filter((w) =>
    w.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.origin_address?.city_locality?.toLowerCase().includes(search.toLowerCase())
  );

  const openDrawer = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 text-slate-100">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-black">🏢 Warehouses</h1>

        <button onClick={fetchWarehouses}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow">
          Refresh
        </button>
      </div>

      <WarehousesToolbar search={search} setSearch={setSearch} />

      {filtered.length === 0 ? (
        <EmptyState isLoading={loading}/>
      ) : (
        <WarehouseTable
          warehouses={filtered}
          onSelect={openDrawer}
        />
      )}

      <WarehouseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        warehouse={selectedWarehouse}
      />

    </div>
  );
}
