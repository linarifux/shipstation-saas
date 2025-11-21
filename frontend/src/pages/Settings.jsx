export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-700 mb-6">
          Configure your ShipStation API credentials and application preferences.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* API Key */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              ShipStation API Key
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Enter your API Key..."
              disabled
            />
          </div>

          {/* API Secret */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              ShipStation API Secret
            </label>
            <input
              type="password"
              className="w-full border rounded p-2"
              placeholder="Enter your API Secret..."
              disabled
            />
          </div>

        </div>

        {/* Save Button */}
        <button
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save Settings
        </button>

      </div>
    </div>
  );
}
