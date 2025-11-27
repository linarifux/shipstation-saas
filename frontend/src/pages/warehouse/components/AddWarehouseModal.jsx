import { useState } from "react";
import axios from "axios";

export default function AddWarehouseModal({ open, onClose, onCreated }) {
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
    if (!form.name || !form.code) return;

    await axios.post("http://localhost:5000/api/warehouses", form);

    onCreated();
    onClose();

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
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-xl w-[550px] border border-slate-800">

        <h2 className="text-xl font-semibold mb-4">➕ Add Warehouse</h2>

        <div className="space-y-3">

          <input
            placeholder="Warehouse Name"
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Code (ex: UK-LON)"
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <input
            placeholder="Address"
            className="w-full bg-slate-800 p-2 rounded border border-slate-700"
            value={form.address.address_line1}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, address_line1: e.target.value },
              })
            }
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="City"
              className="bg-slate-800 p-2 rounded border border-slate-700"
              value={form.address.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, city: e.target.value },
                })
              }
            />

            <input
              placeholder="State"
              className="bg-slate-800 p-2 rounded border border-slate-700"
              value={form.address.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, state: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Postal Code"
              className="bg-slate-800 p-2 rounded border border-slate-700"
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
              className="bg-slate-800 p-2 rounded border border-slate-700"
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

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  );
}
