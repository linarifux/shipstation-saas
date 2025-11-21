export default function CustomsInfo({ data }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <h3 className="text-sm text-slate-300 mb-3 font-semibold">Customs Info</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-400">Contents</p>
          <p className="text-slate-100">{data.contents}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Non-Delivery</p>
          <p className="text-slate-100">{data.non_delivery}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Declared Value</p>
          <p className="text-slate-100">
            {data.customs_items?.[0]?.value}{" "}
            {data.customs_items?.[0]?.value_currency?.toUpperCase()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Origin</p>
          <p className="text-slate-100">
            {data.customs_items?.[0]?.country_of_origin}
          </p>
        </div>
      </div>
    </div>
  );
}
