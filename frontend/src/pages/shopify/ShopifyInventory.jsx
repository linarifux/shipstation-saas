import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";

// Redux Actions
import { 
  fetchShopifyInventory, 
  updateShopifyStock, 
  syncShopifyToMaster 
} from "../../store/slices/shopifySlice";

import { fetchMasterProducts } from "../../store/slices/masterProductSlice";

// Components
import ShopifyInventoryHeader from "../../components/shopify/ShopifyInventoryHeader";
import ShopifyInventoryTable from "../../components/shopify/ShopifyInventoryTable";
import LinkShopifyModal from "../../components/shopify/LinkShopifyModal";

export default function ShopifyInventory() {
  const dispatch = useDispatch();
  
  // 1. Select State from Redux
  const { products, locations, loading, error } = useSelector((state) => state.shopify);
  const { items: masterProducts } = useSelector((state) => state.masterProducts);

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedShopify, setSelectedShopify] = useState(null);

  // 2. Initial Fetch
  useEffect(() => {
    dispatch(fetchShopifyInventory());
    dispatch(fetchMasterProducts()); // Ensure master products are loaded for linking
  }, [dispatch]);

  /* ------------------------------------ */
  /* HANDLERS */
  /* ------------------------------------ */

  // ✅ The Refresh Button Action
  const handleRefresh = () => {
    dispatch(fetchShopifyInventory());
  };

  const handleUpdateStock = async (inventory_item_id, location_id, newQty) => {
    if (!inventory_item_id || !location_id) return;
    
    toast.promise(
      dispatch(updateShopifyStock({ 
        inventory_item_id, 
        location_id, 
        available: newQty 
      })).unwrap(),
      {
        loading: 'Updating stock...',
        success: 'Stock updated!',
        error: (err) => `Failed: ${err}`
      }
    );
  };

  const handleSyncFromMaster = async (masterProduct) => {
    toast.promise(
      dispatch(syncShopifyToMaster(masterProduct)).unwrap(),
      {
        loading: 'Syncing...',
        success: 'Synced with Master Product!',
        error: (err) => `Sync failed: ${err}`
      }
    );
  };

  const openLinkModal = (product) => {
    if (!product) return;
    setSelectedShopify(product);
    setLinkModalOpen(true);
  };

  /* ------------------------------------ */
  /* UI RENDER */
  /* ------------------------------------ */
  return (
    <div className="p-4 md:p-6 text-slate-100 max-w-full pb-20">
      
      {/* HEADER (Always Visible) */}
      <div className="mb-6">
        <ShopifyInventoryHeader onRefresh={handleRefresh} />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
          <HashLoader size={55} color="#06b6d4" />
        </div>
      ) : (
        <>
          {/* EMPTY STATE */}
          {!products || products.length === 0 ? (
            <div className="text-center text-slate-400 mt-10 text-base md:text-lg border border-slate-800 rounded-xl p-10 bg-slate-900/50">
              No Shopify inventory found
            </div>
          ) : (
            /* DATA TABLE */
            <div className="w-full">
              <ShopifyInventoryTable
                products={products}
                masterProducts={masterProducts}
                locations={locations} // ✅ Passed from Redux
                onUpdate={handleUpdateStock}
                onSync={handleSyncFromMaster}
                onLink={openLinkModal}
                refresh={handleRefresh}
              />
            </div>
          )}
        </>
      )}

      {/* LINK MODAL */}
      <LinkShopifyModal
        open={linkModalOpen}
        onClose={() => {
          setLinkModalOpen(false);
          setSelectedShopify(null);
        }}
        shopifyProduct={selectedShopify}
        masterProducts={masterProducts}
        onLinked={() => {
          handleRefresh();
          setLinkModalOpen(false);
          setSelectedShopify(null);
        }}
      />
    </div>
  );
}