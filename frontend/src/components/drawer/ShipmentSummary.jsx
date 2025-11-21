export default function ShipmentSummary({ shipment }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 grid grid-cols-2 gap-4">
      
      <div>
        <p className="text-xs text-slate-400">Service</p>
        <p className="text-slate-100">{shipment.service_code}</p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Carrier</p>
        <p className="text-slate-100">{shipment.carrier_id}</p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Weight</p>
        <p className="text-slate-100">
          {shipment.total_weight?.value} {shipment.total_weight?.unit}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">Ship Date</p>
        <p className="text-slate-100">
          {shipment.ship_date
            ? new Date(shipment.ship_date).toLocaleDateString()
            : "-"}
        </p>
      </div>
    </div>
  );
}
