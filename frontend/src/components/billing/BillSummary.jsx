export default function BillSummary({ items }) {
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-slate-700">
        Bill Summary
      </h2>

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span>₹{subtotal}</span>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
        Generate Invoice
      </button>
    </div>
  );
}
