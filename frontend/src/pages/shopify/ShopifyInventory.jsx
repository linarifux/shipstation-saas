import { useState } from "react";
import { HashLoader } from "react-spinners";
import axios from "axios";

import useShopifyInventory from "../../hooks/useShopifyInventory";
import ShopifyInventoryHeader from "../../components/shopify/ShopifyInventoryHeader";
import ShopifyInventoryTable from "../../components/shopify/ShopifyInventoryTable";
import LinkShopifyModal from "../../components/shopify/LinkShopifyModal";

export default function ShopifyInventory() {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedShopify, setSelectedShopify] = useState(null);
  const [error, setError] = useState("");

  const {
    products = [],
    masterProducts = [],
    locations = {},
    loading,
    refresh,
  } = useShopifyInventory();

  /* ------------------------------------ */
  /* UPDATE STOCK */
  /* ------------------------------------ */
  async function updateStock(inventory_item_id, location_id, newQty) {
    try {
      if (!inventory_item_id || !location_id) return;

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shopify/inventory/update`, {
        inventory_item_id,
        location_id,
        available: Number(newQty),
      });

      refresh();
    } catch (err) {
      console.error("Update error:", err);
      window.alert("Failed to update Shopify stock");
    }
  }

  /* ------------------------------------ */
  /* SYNC FROM MASTER */
  /* ------------------------------------ */
  async function syncFromMaster(masterProduct) {
    try {
      if (!masterProduct || !masterProduct?.channels?.shopify?.sku) {
        return window.alert("This master product is not linked to Shopify.");
      }

      const total = masterProduct.totalAvailable;

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/shopify/inventory/sync`, {
        sku: masterProduct.channels.shopify.sku,
        quantity: total,
      });

      refresh();
    } catch (err) {
      console.error("Sync error:", err);
      window.alert("Failed to sync inventory from Master Product");
    }
  }

  /* ------------------------------------ */
  /* OPEN LINK MODAL */
  /* ------------------------------------ */
  function openLinkModal(product) {
    if (!product) return;

    setSelectedShopify(product);
    setLinkModalOpen(true);
  }

  /* ------------------------------------ */
  /* LOADING STATE */
  /* ------------------------------------ */
  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-[70vh]">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  /* ------------------------------------ */
  /* MAIN UI */
  /* ------------------------------------ */
  return (
    <div className="p-6 text-slate-100">
      
      {/* HEADER */}
      <ShopifyInventoryHeader onRefresh={refresh} />

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!products || products.length === 0 ? (
        <div className="text-center text-slate-400 mt-10 text-lg">
          No Shopify inventory found
        </div>
      ) : (
        <ShopifyInventoryTable
          products={products}
          masterProducts={masterProducts}
          locations={locations}
          onUpdate={updateStock}
          onSync={syncFromMaster}
          onLink={openLinkModal}
          refresh={refresh}
        />
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
          refresh();
          setLinkModalOpen(false);
          setSelectedShopify(null);
        }}
      />
    </div>
  );
}
