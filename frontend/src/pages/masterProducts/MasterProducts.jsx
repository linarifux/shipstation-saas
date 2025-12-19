import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMasterProducts } from "../../store/slices/masterProductSlice";
import { HashLoader } from "react-spinners";
import { Package, RefreshCw, Plus } from "lucide-react";

import MasterProductsTable from "../../components/master-products/MasterProductsTable";
import AddProductModal from "../../components/master-products/AddProductModal";
import AddStockModal from "../../components/master-products/AddStockModal";

export default function MasterProducts() {
  const dispatch = useDispatch();
  
  const { items: products, loading, error } = useSelector((state) => state.masterProducts);

  const [openAdd, setOpenAdd] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchMasterProducts());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMasterProducts());
  };

  return (
    <div className="p-4 md:p-6 text-slate-100 max-w-full pb-20">

      {/* HEADER (Always Visible) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
          <Package className="text-cyan-400" /> Master Products
        </h1>

        <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-900/20"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20 whitespace-nowrap"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-xl mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ✅ LOADING STATE (Handles Initial Load & Refresh) */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh] md:min-h-[60vh]">
          <HashLoader size={55} color="#06b6d4" />
        </div>
      ) : (
        <>
          {/* DATA CONTENT */}
          <div className="w-full">
            <MasterProductsTable
              products={products}
              refresh={handleRefresh}
              openStockModal={(product) => {
                setSelectedProduct(product);
                setStockModalOpen(true);
              }}
            />
          </div>

          {/* EMPTY STATE */}
          {!error && products.length === 0 && (
            <div className="text-center py-12 px-4 border border-slate-800 rounded-xl bg-slate-900/50 mt-6">
              <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Package className="text-slate-500" />
              </div>
              <p className="text-slate-400">No master products found.</p>
              <button 
                 onClick={() => setOpenAdd(true)}
                 className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium hover:underline"
              >
                Create your first product
              </button>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      <AddProductModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreated={handleRefresh}
      />

      <AddStockModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        product={selectedProduct}
        onUpdated={handleRefresh}
      />
    </div>
  );
}