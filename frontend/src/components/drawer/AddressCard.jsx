export default function AddressCard({ title, data }) {
  if (!data) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <h3 className="text-sm text-slate-300 mb-2 font-semibold">{title}</h3>

      <div className="space-y-1 text-slate-200 text-sm">
        <p>{data.name}</p>
        <p>{data.company_name}</p>
        <p>{data.address_line1}</p>
        {data.address_line2 && <p>{data.address_line2}</p>}
        <p>
          {data.city_locality}, {data.state_province} {data.postal_code}
        </p>
        <p>{data.country_code}</p>
      </div>
    </div>
  );
}
