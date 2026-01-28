// components/billing/BillingForm.jsx
export default function BillingForm() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold mb-4">Billing</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="input" placeholder="Search Product" />
        <input className="input" placeholder="Quantity" />
        <input
          className="input bg-gray-100"
          placeholder="Total"
          disabled
        />
      </div>

      <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg">
        Generate Bill
      </button>
    </div>
  );
}
