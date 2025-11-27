import { useEffect, useState } from "react";
import axios from "axios";

export default function useShopifyInventory() {
  const [products, setProducts] = useState([]);
  const [masterProducts, setMasterProducts] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [invRes, masterRes, locRes] = await Promise.all([
        axios.get("http://localhost:5000/api/shopify/inventory"),
        axios.get("http://localhost:5000/api/master-products"),
        axios.get("http://localhost:5000/api/shopify/locations"),
      ]);

      const locMap = {};
      locRes.data.locations.forEach((l) => {
        locMap[l.id] = l.name;
      });

      setProducts(invRes.data.products || []);
      setMasterProducts(masterRes.data.products || []);
      setLocations(locMap);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    products,
    masterProducts,
    locations,
    loading,
    refresh: fetchAll
  };
}
