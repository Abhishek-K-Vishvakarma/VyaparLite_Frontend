import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../network/UrlProvider";

export default function InvoiceList({ token }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch invoices from backend
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ url }/invoice/invoice-list`, {
        credentials: "include"
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch invoices");
      }

      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  // Download invoice PDF
  const handleDownload = async (invoice) => {
    if (!invoice.pdfUrl) {
      toast.error("No PDF available for this invoice");
      return;
    }

    try {
      // Open PDF in new tab
      window.open(invoice.pdfUrl);

      // Trigger download
      const a = document.createElement("a");
      a.href = invoice.pdfUrl;
      a.download = `invoice-${ invoice.invoiceNumber }.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Invoice opened & downloaded ✅");
    } catch (err) {
      console.error(err);
      toast.error("Download failed ❌");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Invoice List</h1>

      {loading && <p className="text-gray-500">Loading invoices...</p>}

      {!loading && invoices.length === 0 && (
        <p className="text-gray-500">No invoices found</p>
      )}

      {!loading && invoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Invoice #</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Qty</th>
                <th className="px-4 py-2 border">Price (₹)</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border font-medium">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-2 border">
                    {inv.items.map((i) => i.name).join(", ")}
                  </td>
                  <td className="px-4 py-2 border">
                    {inv.items.map((i) => i.qty.toFixed(2)).join(", ")}
                  </td>
                  <td className="px-4 py-2 border">
                    {inv.items
                      .map((i) => (i.qty * i.price).toFixed(2))
                      .join(", ")}
                  </td>
                  <td className="px-4 py-2 border">{inv.userName}</td>
                  <td className="px-4 py-2 border">
                    {new Date(inv.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDownload(inv)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
