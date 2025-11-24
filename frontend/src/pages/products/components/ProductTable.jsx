import ProductRow from "./ProductRow";

export default function ProductTable({ products, onSelect }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">SKU</th>
            <th className="p-3 text-center">Stock</th>
            <th className="p-3 text-center">Shops</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <ProductRow key={p.product_id} product={p} onClick={() => onSelect(p)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
