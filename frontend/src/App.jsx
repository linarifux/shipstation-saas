import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Shipments from "./pages/Shipments";
import Automation from "./pages/Automation"; // for future
import Settings from "./pages/Settings"; // for future
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Products from "./pages/products/Products";
import Warehouses from "./pages/warehouse/Warehouse";
import LocationIntelligence from "./pages/intelligence/LocationIntelligence";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/warehouse" element={<Warehouses />} />
        <Route path="/intelligence" element={<LocationIntelligence />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
