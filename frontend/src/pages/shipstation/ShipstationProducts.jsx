import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { Package, RefreshCw } from "lucide-react";

/* Components */
import ShipstationProductsTable from "../../components/shipstation/ShipstationProductsTable";
import LinkShipstationModal from "../../components/shipstation/LinkShipstationModal";

export default function ShipstationProducts() {
  const [ssProducts, setSsProducts] = useState([]);
  const [masterProducts, setMasterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedSsProduct, setSelectedSsProduct] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch ShipStation Products (You need this endpoint on your backend)
      const ssRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/shipstation/products`);
      
      // 2. Fetch Master Products (to check links)
      const masterRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/master-products`);

      setSsProducts(ssRes.data?.products || []);
      setMasterProducts(masterRes.data?.products || []);

    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filtered = ssProducts.filter(
    (p) =>
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- HANDLERS ---------------- */
  const openLinkModal = (product) => {
    setSelectedSsProduct(product);
    setLinkModalOpen(true);
  };

  /* ---------------- RENDER ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] md:min-h-[70vh]">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-slate-100 max-w-full pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
          <Package className="text-indigo-400" /> ShipStation Products
        </h1>

        <button
          onClick={fetchData}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 w-full sm:w-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search ShipStation SKU or Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
      />

      {/* TABLE / CARDS */}
      <div className="w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/50">
            <p className="text-slate-400">No products found.</p>
          </div>
        ) : (
          <ShipstationProductsTable
            ssProducts={filtered}
            masterProducts={masterProducts}
            onLink={openLinkModal}
            refresh={fetchData}
          />
        )}
      </div>

      {/* LINK MODAL */}
      <LinkShipstationModal
        open={linkModalOpen}
        onClose={() => {
          setLinkModalOpen(false);
          setSelectedSsProduct(null);
        }}
        shipstationProduct={selectedSsProduct}
        masterProducts={masterProducts}
        onLinked={() => {
          fetchData();
          setLinkModalOpen(false);
          setSelectedSsProduct(null);
        }}
      />
    </div>
  );
}