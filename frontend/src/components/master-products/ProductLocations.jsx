import { useState } from "react"
import axios from "axios"
import { Edit3, PlusCircle, Repeat } from "lucide-react"

export default function ProductLocations({ product, refresh, onAddStock }) {

  const locations = product.locations || []
  console.log(product);
  
  const shopifyLocations = product.shopifyLevels || []

  const totalOnHand = locations.reduce((s, l) => s + (l.onHand || 0), 0)
  const totalReserved = locations.reduce((s, l) => s + (l.reserved || 0), 0)
  const totalAvailable = locations.reduce((s, l) => s + (l.available || 0), 0)

  const [editing, setEditing] = useState({})

  const handleChange = (id, value) => {
    setEditing((prev) => ({ ...prev, [id]: value }))
  }

  const handleUpdate = async (warehouseId) => {
    const newQty = Number(editing[warehouseId])
    if (Number.isNaN(newQty)) return

    await axios.patch(
      `http://localhost:5000/api/master-products/${product._id}/stock`,
      { warehouseId, available: newQty }
    )

    setEditing((prev) => ({ ...prev, [warehouseId]: undefined }))
    refresh()
  }

  return (
    <div className="space-y-6">

      {/* ================= ADD NEW LOCATION ================= */}
      <div className="flex justify-between">
        <h3 className="text-sm font-semibold text-slate-300">
          📦 Internal Warehouses
        </h3>

        <button
          onClick={() => onAddStock(product)}
          className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 px-3 py-1 rounded text-sm"
        >
          <PlusCircle size={14} />
          Add Location
        </button>
      </div>

      {/* ================= INTERNAL LOCATIONS TABLE ================= */}
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-900 text-slate-300">
            <tr className="text-left">
              <th className="p-2 text-left">Location</th>
              <th className="p-2">On Hand</th>
              <th className="p-2">Reserved</th>
              <th className="p-2">Available</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((loc) => {
              const id = loc.warehouse?._id || loc.warehouse

              return (
                <tr key={id} className="border-t border-slate-800 text-left">
                  
                  <td className="p-2">
                    <div className="font-medium">
                      {loc.warehouse?.name || "Unknown"}
                    </div>

                    <span className="text-[10px] text-slate-500">
                      Internal Warehouse
                    </span>
                  </td>

                  <td className="p-2">{loc.onHand || 0}</td>
                  <td className="p-2">{loc.reserved || 0}</td>

                  <td className="p-2 font-semibold text-cyan-400">
                    {loc.available || 0}
                  </td>

                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1"
                        value={editing[id] ?? loc.available ?? 0}
                        onChange={(e) =>
                          handleChange(id, e.target.value)
                        }
                      />

                      <button
                        onClick={() => handleUpdate(id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-[11px] px-2 py-1 rounded"
                      >
                        <Edit3 size={12} />
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {locations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-slate-500">
                  No internal locations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>





      {/* ================= SHOPIFY LOCATIONS ================= */}

      {product.channels?.shopify && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400">
            🌐 Shopify Locations
          </h3>

          {shopifyLocations.length === 0 && (
            <p className="text-slate-400 text-sm">
              No Shopify locations found for this product
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-3">

            {shopifyLocations.map((loc, index) => (
              <div
                key={loc.location_id || index}
                className="bg-indigo-900/20 border border-indigo-600 rounded-lg p-3"
              >
                <div className="text-sm font-medium">
                  Location ID: {loc.location_id}
                </div>

                <div className="text-xs text-indigo-300 mt-1">
                  Shopify
                </div>

                <div className="text-2xl text-indigo-400 font-bold mt-2">
                  {loc.available}
                </div>

                <button
                  className="mt-3 flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-100"
                >
                  <Repeat size={12} />
                  Sync to Master
                </button>
              </div>
            ))}

          </div>
        </div>
      )}



      {/* ================= AMAZON (READY) ================= */}
      {product.channels?.amazon && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-orange-400">
            🛒 Amazon Locations
          </h3>

          <p className="text-slate-400 text-sm">
            Amazon stock will appear here when connected
          </p>
        </div>
      )}



      {/* ================= WALMART (READY) ================= */}
      {product.channels?.walmart && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-400">
            🏬 Walmart Locations
          </h3>

          <p className="text-slate-400 text-sm">
            Walmart stock will appear here when connected
          </p>
        </div>
      )}

    </div>
  )
}
