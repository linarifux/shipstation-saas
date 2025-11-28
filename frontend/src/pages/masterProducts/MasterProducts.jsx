import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";

/* Components */
import MasterProductsTable from "../../components/master-products/MasterProductsTable";
import AddProductModal from "../../components/master-products/AddProductModal";
import AddStockModal from "../../components/master-products/AddStockModal";

export default function MasterProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState("");

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:5000/api/master-products");

      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load master products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-6 text-slate-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">🧾 Master Products</h1>

        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded"
          >
            Refresh
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 p-4 rounded mb-4 text-red-400">
          {error}
        </div>
      )}

      {/* TABLE */}
      <MasterProductsTable
        products={products}
        refresh={fetchProducts}
        openStockModal={(product) => {
          setSelectedProduct(product);
          setStockModalOpen(true);
        }}
      />

      {/* NO PRODUCTS */}
      {!error && products.length === 0 && (
        <p className="text-center text-slate-500 mt-10">
          No master products found. Add your first product.
        </p>
      )}

      {/* ADD PRODUCT MODAL */}
      <AddProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={fetchProducts}
      />

      {/* ADD STOCK MODAL */}
      <AddStockModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        product={selectedProduct}
        onUpdated={fetchProducts}
      />
    </div>
  );
}
