export default function Automation() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Automation Rules</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-700 mb-4">
          This section will allow you to automate custom field updates, shipment logic,
          label creation, and more using ShipStation API.
        </p>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">No rules created yet</h2>
          <p className="text-gray-600 mb-4">
            You can start adding automation rules such as:
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Automatically insert text into Custom Field 1</li>
            <li>Apply rules based on shipment status</li>
            <li>Generate labels after order update</li>
            <li>Map product data into custom fields</li>
          </ul>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Automation Rule
          </button>
        </div>
      </div>
    </div>
  );
}
