import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Shipments from "./pages/Shipments";
import Automation from "./pages/Automation"; // for future
import Settings from "./pages/Settings"; // for future
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Products from "./pages/products/Products";
import Warehouses from "./pages/warehouse/Warehouse";
import LocationIntelligence from "./pages/intelligence/LocationIntelligence";
import ShopifyOrders from "./pages/shopify/ShopifyOrders";
import ShopifyInventory from "./pages/shopify/ShopifyInventory";
import DashboardLayout from "./components/layout/DashboardLayout";
import MasterProducts from "./pages/masterProducts/MasterProducts";
import ShipstationProducts from "./pages/shipstation/ShipstationProducts";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Layout wrapper */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/warehouse" element={<Warehouses />} />
          <Route path="/intelligence" element={<LocationIntelligence />} />
          <Route path="/shopify-orders" element={<ShopifyOrders />} />
          <Route path="/inventory" element={<ShopifyInventory />} />
          <Route path="/master-products" element={<MasterProducts />} />
          <Route path="/shipstation-products" element={<ShipstationProducts />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
