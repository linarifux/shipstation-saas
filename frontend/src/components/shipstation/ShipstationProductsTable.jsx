import { Link2, Unlink, AlertCircle, ShoppingBag } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ShipstationProductsTable({ 
  ssProducts, 
  masterProducts, 
  onLink, 
  refresh 
}) {
  
  /* Helper: Find linked master product */
  const getLinkedMaster = (ssSku) => {
    return masterProducts.find(
      (mp) => mp.channels?.shipstation?.sku === ssSku
    );
  };

  /* Helper: Unlink Action */
  const handleUnlink = async (masterId) => {
    if (!masterId) return;
    
    // Toast confirmation
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">Unlink from ShipStation?</span>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeUnlink(masterId);
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded"
          >
            Yes, Unlink
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-slate-700 text-white text-xs px-3 py-1.5 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const executeUnlink = async (masterId) => {
    try {
      await toast.promise(
        axios.patch(`${import.meta.env.VITE_BACKEND_URL}/master-products/${masterId}/unlink-shipstation`),
        {
          loading: "Unlinking...",
          success: "Unlinked successfully",
          error: "Failed to unlink",
        }
      );
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 🖥️ DESKTOP VIEW */}
      <div className="hidden md:block overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Master Link Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {ssProducts.map((p) => {
              const master = getLinkedMaster(p.sku);
              return (
                <tr key={p.productId || p.sku} className="border-t border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="p-4 font-medium text-slate-200">{p.name}</td>
                  <td className="p-4 font-mono text-slate-400">{p.sku}</td>
                  
                  {/* Link Status Column */}
                  <td className="p-4">
                    {master ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Link2 size={16} />
                        <span className="font-medium">{master.name}</span>
                        <span className="text-xs text-slate-500 font-mono">({master.masterSku})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 italic">
                        <AlertCircle size={16} />
                        Not Linked
                      </div>
                    )}
                  </td>

                  {/* Action Column */}
                  <td className="p-4 text-right">
                    {master ? (
                      <button
                        onClick={() => handleUnlink(master._id)}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 py-1.5 rounded transition text-xs border border-transparent hover:border-red-500/20"
                      >
                        Unlink
                      </button>
                    ) : (
                      <button
                        onClick={() => onLink(p)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition text-xs shadow-lg shadow-indigo-900/20"
                      >
                        Link to Master
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE VIEW */}
      <div className="md:hidden flex flex-col gap-4">
        {ssProducts.map((p) => {
          const master = getLinkedMaster(p.sku);
          return (
            <div key={p.productId || p.sku} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
              
              {/* Header */}
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">{p.name}</h3>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-xs font-mono text-slate-400">
                  {p.sku}
                </span>
              </div>

              {/* Status Box */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 block">
                  Link Status
                </span>
                {master ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <Link2 size={16} />
                    Linked to: {master.name}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                    <AlertCircle size={16} />
                    Not linked to any master product
                  </div>
                )}
              </div>

              {/* Action Button */}
              {master ? (
                <button
                  onClick={() => handleUnlink(master._id)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-500/30 text-red-400 py-2.5 rounded-lg text-sm transition-all"
                >
                  <Unlink size={16} /> Unlink
                </button>
              ) : (
                <button
                  onClick={() => onLink(p)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all"
                >
                  <Link2 size={16} /> Link to Master Product
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}