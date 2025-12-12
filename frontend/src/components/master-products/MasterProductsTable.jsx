import { useState } from "react";
import MasterProductRow from "./MasterProductRow";

export default function MasterProductsTable({ products, refresh, openStockModal }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!products.length) {
    return <p className="text-slate-500">No products found</p>;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300 text-left">
          <tr>
            <th className="p-3"></th>
            <th className="p-3">Product</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Available</th>
            <th className="p-3">Channels</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <MasterProductRow
              key={product._id}
              product={product}
              expanded={!!expanded[product._id]}
              onToggle={() => toggle(product._id)}
              refresh={refresh}
              onAddStock={openStockModal}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
