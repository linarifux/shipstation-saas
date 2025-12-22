import { X, Package, Truck, MapPin, Calendar, ExternalLink, User, Box } from "lucide-react";
import StatusBadge from "../StatusBadge";


export default function ShipmentDrawer({ open, onClose, shipment }) {
  if (!open || !shipment) return null;

  const {
    shipment_number,
    shipment_status,
    ship_date,
    tracking_number,
    carrier_id,
    service_code,
    ship_to = {},
    total_weight,
    packages = [],
    external_order_id,
  } = shipment;

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to build address string
  const formatAddress = (addr) => {
    if (!addr) return "N/A";
    const parts = [
      addr.street1,
      addr.street2,
      addr.city,
      addr.state,
      addr.postal_code,
      addr.country_code,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end animate-in fade-in duration-200">
      
      {/* DRAWER PANEL */}
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Package className="text-cyan-400" />
              {shipment_number}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={shipment_status} />
              {external_order_id && (
                <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Ord: {external_order_id}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* SECTION: SHIPPING INFO */}
          <Section title="Shipping Details" icon={Truck}>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Line label="Carrier" value={carrier_id} uppercase />
                <Line label="Service" value={service_code} />
              </div>
              <Line label="Ship Date" value={formatDate(ship_date)} />
              
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Tracking Number</p>
                {tracking_number ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 text-sm">{tracking_number}</span>
                    <a 
                      href={`https://www.google.com/search?q=${tracking_number}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                      title="Track Package"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ) : (
                  <span className="text-slate-600 italic text-sm">Not generated yet</span>
                )}
              </div>
            </div>
          </Section>

          {/* SECTION: RECIPIENT */}
          <Section title="Recipient" icon={User}>
             <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-slate-200 font-medium text-lg">{ship_to.name}</p>
                {ship_to.company && <p className="text-slate-400 text-sm">{ship_to.company}</p>}
                
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-800">
                  <MapPin size={14} className="text-slate-500 mt-1 shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {formatAddress(ship_to)}
                  </p>
                </div>
                
                {ship_to.email && (
                  <p className="text-xs text-slate-500 mt-2 pl-6">{ship_to.email}</p>
                )}
             </div>
          </Section>

          {/* SECTION: PACKAGES */}
          <Section title="Package Specs" icon={Box}>
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <Line 
                  label="Total Weight" 
                  value={total_weight ? `${total_weight.value} ${total_weight.unit}` : "N/A"} 
                />
                <Line label="Package Count" value={packages.length || 1} />
              </div>
              
              {packages.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Dimensions</p>
                  {packages.map((pkg, idx) => (
                    <div key={idx} className="text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                      Box {idx + 1}: {pkg.length} x {pkg.width} x {pkg.height} ({pkg.units})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
           >
             Close
           </button>
        </div>

      </div>
    </div>
  );
}

/* -------- SUB COMPONENTS -------- */

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-cyan-500" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Line({ label, value, uppercase }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">{label}</p>
      <p className={`text-slate-200 font-medium ${uppercase ? "uppercase" : ""}`}>
        {value || <span className="text-slate-600 italic">--</span>}
      </p>
    </div>
  );
}