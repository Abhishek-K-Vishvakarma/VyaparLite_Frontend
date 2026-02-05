export default function BillSummary({ items }) {
  const total = items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  return (
    <div className="bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-3">Summary</h2>

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      {/* <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg">
        Generate Invoice
      </button> */}
    </div>
  );
}
