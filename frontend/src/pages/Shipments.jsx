import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { Package, Truck, Calendar, User, Scale, FileText } from "lucide-react"; // Icons for mobile cards
import ShipmentDrawer from "../components/drawer/ShipmentDrawer";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shipments`);
      setShipments(res.data.shipments);
    } catch (err) {
    } finally {
      setLoading(false);
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
    <div className="text-slate-100 pb-20"> {/* pb-20 adds space at bottom for mobile */}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">📦 Shipments</h1>
        <button
          onClick={fetchShipments}
          className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow text-white font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by shipment # or customer name…"
        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 w-full mb-6 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <HashLoader size={55} color="#06b6d4" />
        </div>
      )}

      {/* DATA DISPLAY */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
              <p>No shipments found matching "{search}"</p>
            </div>
          ) : (
            <>
              {/* 🖥️ DESKTOP VIEW: Standard Table (Hidden on Mobile) */}
              <div className="hidden md:block rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="p-4 font-medium">Shipment #</th>
                      <th className="p-4 font-medium">Order #</th>
                      <th className="p-4 font-medium">Recipient</th>
                      <th className="p-4 font-medium">Carrier</th>
                      <th className="p-4 font-medium">Service</th>
                      <th className="p-4 font-medium">Weight</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Ship Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr
                        key={s.shipment_id}
                        onClick={() => openDrawer(s)}
                        className="border-t border-slate-800 hover:bg-slate-800/50 transition cursor-pointer"
                      >
                        <td className="p-4 font-medium text-cyan-400">{s.shipment_number}</td>
                        <td className="p-4">{s.external_order_id || "-"}</td>
                        <td className="p-4">{s.ship_to?.name}</td>
                        <td className="p-4">{s.carrier_id}</td>
                        <td className="p-4">
                          <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                            {s.service_code}
                          </span>
                        </td>
                        <td className="p-4">
                          {s.total_weight?.value} {s.total_weight?.unit}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={s.shipment_status} />
                        </td>
                        <td className="p-4 text-slate-400">
                          {s.ship_date
                            ? new Date(s.ship_date).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📱 MOBILE VIEW: Cards (Hidden on Desktop) */}
              <div className="md:hidden flex flex-col gap-4">
                {filtered.map((s) => (
                  <div
                    key={s.shipment_id}
                    onClick={() => openDrawer(s)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    {/* Top Row: ID + Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-cyan-400 font-bold text-lg flex items-center gap-2">
                          <Package size={18} />
                          {s.shipment_number}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <FileText size={12} />
                          Order: {s.external_order_id || "N/A"}
                        </div>
                      </div>
                      <StatusBadge status={s.shipment_status} />
                    </div>

                    {/* Middle Grid: Details */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <User size={12} /> Recipient
                        </span>
                        <span className="font-medium truncate">{s.ship_to?.name}</span>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <Truck size={12} /> Carrier
                        </span>
                        <span className="font-medium uppercase">{s.carrier_id}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                           Service
                        </span>
                        <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-xs w-fit">
                          {s.service_code}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <Scale size={12} /> Weight
                        </span>
                        <span>{s.total_weight?.value} {s.total_weight?.unit}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Date */}
                    <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Shipped: {s.ship_date ? new Date(s.ship_date).toLocaleDateString() : "-"}
                      </div>
                      <span className="text-cyan-600 font-medium">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* DRAWER */}
      <ShipmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        shipment={drawerData}
      />
    </div>
  );
}

// 🎨 Helper Component for Status Colors
function StatusBadge({ status }) {
  let styles = "bg-slate-700 text-slate-300 border-slate-600";
  
  if (status === "shipped" || status === "delivered") {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (status === "voided" || status === "cancelled") {
    styles = "bg-red-500/10 text-red-400 border-red-500/20";
  } else if (status === "label_created") {
    styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} uppercase tracking-wide`}>
      {status}
    </span>
  );
}