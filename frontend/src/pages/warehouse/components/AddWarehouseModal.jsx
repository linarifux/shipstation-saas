import { useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2, X, MapPin, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { createWarehouse } from "../../../store/slices/warehouseSlice";

export default function AddWarehouseModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: {
      address_line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.code) {
      toast.error("Name and Code are required");
      return;
    }

    setLoading(true);
    try {
      // Dispatch Redux Action
      await dispatch(createWarehouse(form)).unwrap();
      
      toast.success("Warehouse created successfully!");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(typeof error === "string" ? error : "Failed to create warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      code: "",
      address: {
        address_line1: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Building2 className="text-emerald-500" /> Add Warehouse
          </h2>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <input
                    placeholder="Warehouse Name"
                    className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <input
                    placeholder="Code (e.g. LON)"
                    className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono uppercase"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 my-2"></div>

          {/* Section 2: Address */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <MapPin size={12} /> Address Location
            </label>
            
            <input
              placeholder="Address Line 1"
              className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              value={form.address.address_line1}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, address_line1: e.target.value },
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="City"
                className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                value={form.address.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, city: e.target.value },
                  })
                }
              />

              <input
                placeholder="State / Region"
                className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                value={form.address.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, state: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Postal Code"
                className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                value={form.address.postal_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, postal_code: e.target.value },
                  })
                }
              />

              <input
                placeholder="Country"
                className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                value={form.address.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, country: e.target.value },
                  })
                }
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Creating...
              </>
            ) : (
              "Create Warehouse"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}