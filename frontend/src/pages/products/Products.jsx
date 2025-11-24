import { useEffect, useState } from "react";
import axios from "axios";

import ProductTable from "./components/ProductTable";
import ProductDrawer from "./components/ProductDrawer";
import ProductFilters from "./components/ProductFilters";
import StatsBar from "./components/StatsBar";
import EmptyState from "./components/EmptyState";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ ADDED

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true); // Start loading
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data.products);
    }finally {
      // No loading state for now
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products[0]);
  

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-slate-100">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold text-black">🛍 Products</h1>

        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow"
        >
          Refresh
        </button>
      </div>

      <StatsBar products={products} />

      <ProductFilters search={search} setSearch={setSearch} />

      {filtered.length === 0 ? (
        <EmptyState isLoading={loading} />
      ) : (
        <ProductTable
          products={filtered}
          onSelect={(p) => {
            setSelectedProduct(p);
            setDrawerOpen(true);
          }}
        />
      )}

      <ProductDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
