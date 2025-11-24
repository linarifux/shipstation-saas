import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HashLoader } from "react-spinners"; // 🔥 Loader

// Drawer
import ShipmentDrawer from "../components/drawer/ShipmentDrawer";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true); // ⬅️ ADDED
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  const fetchShipments = async () => {
    try {
      setLoading(true); // Start loading
      const res = await axios.get("http://localhost:5000/shipments");
      setShipments(res.data.shipments);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const filtered = shipments.filter(
    (s) =>
      s.shipment_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.ship_to?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openDrawer = (shipment) => {
    setDrawerData(shipment);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 text-slate-100">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-black">📦 Shipments</h1>

        <button
          onClick={fetchShipments}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow text-white"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by shipment # or customer name…"
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full mb-4 text-slate-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🌟 Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <HashLoader size={55} color="#06b6d4" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 sticky top-0">
              <tr>
                <Th label="Shipment #" />
                <Th label="Order #" />
                <Th label="Recipient" />
                <Th label="Carrier" />
                <Th label="Service" />
                <Th label="Weight" />
                <Th label="Status" />
                <Th label="Ship Date" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.shipment_id}
                  onClick={() => openDrawer(s)}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <td className="p-3">{s.shipment_number}</td>
                  <td className="p-3">{s.external_order_id || "-"}</td>
                  <td className="p-3">{s.ship_to?.name}</td>
                  <td className="p-3">{s.carrier_id}</td>
                  <td className="p-3">{s.service_code}</td>
                  <td className="p-3">
                    {s.total_weight?.value} {s.total_weight?.unit}
                  </td>
                  <td className="p-3">{s.shipment_status}</td>
                  <td className="p-3">
                    {s.ship_date
                      ? new Date(s.ship_date).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer */}
      <ShipmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        shipment={drawerData}
      />
    </div>
  );
}

// Column header
function Th({ label }) {
  return <th className="p-3">{label}</th>;
}
