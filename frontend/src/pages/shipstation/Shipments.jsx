import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import ShipmentsHeader from "../../components/shipstation/ShipmentsHeader";
import ShipmentsSearch from "../../components/shipstation/ShipmentsSearch";
import ShipmentsTable from "../../components/shipstation/ShipmentsTable";
import ShipmentsMobileList from "../../components/shipstation/ShipmentsMobileList";
import ShipmentDrawer from "../../components/shipstation/drawer/ShipmentDrawer";


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
      console.error(err);
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
    <div className="text-slate-100 pb-20">
      
      {/* 1. Header */}
      <ShipmentsHeader onRefresh={fetchShipments} />

      {/* 2. Search */}
      <ShipmentsSearch search={search} setSearch={setSearch} />

      {/* 3. Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <HashLoader size={55} color="#06b6d4" />
        </div>
      )}

      {/* 4. Data Display */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
              <p>No shipments found matching "{search}"</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <ShipmentsTable shipments={filtered} onOpenDrawer={openDrawer} />

              {/* Mobile View */}
              <ShipmentsMobileList shipments={filtered} onOpenDrawer={openDrawer} />
            </>
          )}
        </>
      )}

      {/* 5. Drawer */}
      <ShipmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        shipment={drawerData}
      />
    </div>
  );
}