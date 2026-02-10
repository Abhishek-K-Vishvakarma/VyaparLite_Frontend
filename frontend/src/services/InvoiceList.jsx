import { useEffect, useState } from "react";
import { toast } from "sonner";
import url from "../network/UrlProvider";

export default function InvoiceList({ token }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ url }/invoice/invoice-list`, {
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch invoices");
      }

      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      toast.error(err.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  const handleDownload = (invoice) => {
    if (!invoice.pdfUrl) {
      toast.error("No PDF available");
      return;
    }
    window.open(invoice.pdfUrl);
  };

  // 🔍 Filter by username
  const filteredInvoices = invoices.filter((inv) =>
    inv.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          📄 Invoices
        </h1>

        <input
          type="text"
          placeholder="Search by user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading && (
        <p className="text-gray-500">Loading invoices...</p>
      )}

      {!loading && filteredInvoices.length === 0 && (
        <p className="text-gray-500">No invoices found</p>
      )}

      {/* Card Style List */}
      <div className="grid gap-4">
        {filteredInvoices.map((inv) => (
          <div
            key={inv._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5"
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice No</p>
                <p className="font-semibold">{inv.invoiceNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{inv.userName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{new Date(inv.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <button
                  onClick={() => handleDownload(inv)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                Items
              </p>

              <div className="space-y-2 text-sm text-gray-700">
                {inv.items.map((i, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                  >
                    {/* Left: Product info */}
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {i.qty} × ₹ {i.price} / {i.unit}
                      </p>
                    </div>

                    {/* Right: Total */}
                    <div className="font-semibold text-gray-800">
                      ₹ {(i.qty * i.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
