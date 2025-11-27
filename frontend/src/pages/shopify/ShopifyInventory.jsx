import { HashLoader } from "react-spinners";
import axios from "axios";

import useShopifyInventory from "../../hooks/useShopifyInventory";
import ShopifyInventoryHeader from "../../components/shopify/ShopifyInventoryHeader";
import ShopifyInventoryTable from "../../components/shopify/ShopifyInventoryTable";
import LinkShopifyModal from "../../components/shopify/LinkShopifyModal";

export default function ShopifyInventory() {

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedShopify, setSelectedShopify] = useState(null);


  const {
    products,
    masterProducts,
    locations,
    loading,
    refresh
  } = useShopifyInventory();

  async function updateStock(inventory_item_id, location_id, newQty) {
    await axios.post("http://localhost:5000/api/shopify/inventory/update", {
      inventory_item_id,
      location_id,
      available: Number(newQty),
    });

    refresh();
  }

  async function syncFromMaster(masterProduct) {
    if (!masterProduct?.channels?.shopify) return;

    const total = masterProduct.totalAvailable;

    await axios.post("http://localhost:5000/api/shopify/inventory/sync", {
      sku: masterProduct.channels.shopify.sku,
      quantity: total,
    });

    refresh();
  }

  function openLinkModal(product) {
    setSelectedShopify(product);
    setLinkModalOpen(true);
  }


  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-[70vh]">
        <HashLoader size={55} color="#06b6d4" />
      </div>
    );
  }

  return (
    <div className="p-6 text-slate-100">
      <ShopifyInventoryHeader onRefresh={refresh} />

      <ShopifyInventoryTable
        products={products}
        masterProducts={masterProducts}
        locations={locations}
        onUpdate={updateStock}
        onSync={syncFromMaster}
        onLink={openLinkModal}
      />
      <LinkShopifyModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        shopifyProduct={selectedShopify}
        masterProducts={masterProducts}
        onLinked={refresh}
      />

    </div>
  );
}

