// components/invoice/InvoicePreview.jsx
export default function InvoicePreview() {
  return (
    <div className="bg-white max-w-md mx-auto rounded-xl border p-6">
      <h2 className="text-center text-lg font-semibold mb-4">
        Invoice
      </h2>

      <div className="text-sm text-slate-600 space-y-2">
        <p>Product: Sugar</p>
        <p>Qty: 2</p>
        <p>Total: ₹90</p>
      </div>

      <div className="border-t mt-4 pt-4 font-semibold">
        Grand Total: ₹90
      </div>
    </div>
  );
}
