import DrawerHeader from "./DrawerHeader";
import ShipmentSummary from "./ShipmentSummary";
import AddressCard from "./AddressCard";
import ItemsList from "./ItemsList";
import CustomsInfo from "./CustomsInfo";

export default function ShipmentDrawer({ open, onClose, shipment }) {
  if (!open || !shipment) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      
      {/* Drawer Panel */}
      <div className="w-[450px] h-full bg-slate-900 border-l border-slate-800 shadow-xl flex flex-col">
        
        {/* Header */}
        <DrawerHeader shipment={shipment} onClose={onClose} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Shipment Summary */}
          <ShipmentSummary shipment={shipment} />

          {/* Addresses */}
          <div className="space-y-4">
            <AddressCard title="Ship To" data={shipment.ship_to} />
            <AddressCard title="Ship From" data={shipment.ship_from} />
            {shipment.return_to && (
              <AddressCard title="Return Address" data={shipment.return_to} />
            )}
          </div>

          {/* Items */}
          <ItemsList items={shipment.items} />

          {/* Customs */}
          {shipment.customs && (
            <CustomsInfo data={shipment.customs} />
          )}

        </div>
      </div>
    </div>
  );
}
