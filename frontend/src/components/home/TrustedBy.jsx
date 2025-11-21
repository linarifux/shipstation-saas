export default function TrustedBy() {
  return (
    <section className="mt-16 text-xs text-slate-400 md:text-sm">
      <p className="mb-3 text-slate-300">Designed for teams shipping across:</p>

      <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-wider text-slate-500">
        <span className="rounded-full border border-slate-700 px-3 py-1">Shopify Brands</span>
        <span className="rounded-full border border-slate-700 px-3 py-1">3PL Warehouses</span>
        <span className="rounded-full border border-slate-700 px-3 py-1">Amazon Sellers</span>
        <span className="rounded-full border border-slate-700 px-3 py-1">Ecommerce Teams</span>
      </div>
    </section>
  );
}
