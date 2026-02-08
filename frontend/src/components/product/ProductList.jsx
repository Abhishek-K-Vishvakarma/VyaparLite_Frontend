import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AddProduct from "./AddProduct";
import url from "../../network/UrlProvider";

// ✅ FIXED: Proper stock formatting
const formatStock = (stock, unit) => {
  if (unit === "KG") {
    const kg = Math.floor(stock);
    const grams = Math.round((stock % 1) * 1000);

    if (kg === 0 && grams > 0) {
      return `${ grams } g`;
    } else if (grams === 0) {
      return `${ kg } KG`;
    } else {
      return `${ kg } KG ${ grams } g`;
    }
  }
  return `${ stock } ${ unit }`;
};

// ✅ FIXED: Low stock check
const isLowStock = (p) => {
  const limits = {
    KG: 5,        // 5 KG minimum
    PIECE: 5,     // 5 pieces minimum
    BOTTLE: 5,    // 5 bottles minimum
    PACKET: 5,    // 5 packets minimum
  };

  // For all units, stock is already in base unit
  return p.stock <= limits[p.unit];
};

const formatIST = (date) =>
  new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${ url }/product/my-products`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (p) => {
    if (p.stock > 0) {
      toast.error("Set stock to 0 before deleting");
      return;
    }

    if (!window.confirm(`Delete "${ p.name }"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${ url }/product/del-product/${ p._id }`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message || "Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const lowStockProducts = products.filter(isLowStock);

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* ================= MODALS ================= */}
      {create && (
        <Modal onClose={() => setCreate(false)}>
          <AddProduct
            onClose={() => setCreate(false)}
            onSuccess={fetchProducts}
          />
        </Modal>
      )}

      {editProduct && (
        <Modal onClose={() => setEditProduct(null)}>
          <AddProduct
            editData={editProduct}
            onClose={() => setEditProduct(null)}
            onSuccess={fetchProducts}
          />
        </Modal>
      )}

      {showLowStock && (
        <Modal onClose={() => setShowLowStock(false)}>
          <h2 className="text-lg font-bold text-red-600 mb-4">
            ⚠️ Low Stock Products
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-center text-slate-500">No low stock products</p>
          ) : (
            lowStockProducts.map((p) => (
              <div
                key={p._id}
                className="mb-3 rounded-xl border-l-4 border-red-500
                bg-red-50 px-4 py-3"
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-700">
                  Stock: <span className="font-bold">{formatStock(p.stock, p.unit)}</span>
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  ₹{p.price} / {p.unit}
                </p>
              </div>
            ))
          )}
        </Modal>
      )}

      {/* ================= PAGE ================= */}
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-blue-600 tracking-wide">
              VyaparLite
            </p>
            <h2 className="text-lg font-bold">Product List</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {lowStockProducts.length > 0 && (
              <button
                onClick={() => setShowLowStock(true)}
                className="rounded-full bg-red-100 px-4 py-2
                text-sm font-semibold text-red-700 hover:bg-red-200 transition"
              >
                ⚠️ Low Stock ({lowStockProducts.length})
              </button>
            )}

            <button
              onClick={() => setCreate(true)}
              className="bg-blue-600 text-white px-4 py-2
              rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Create Product
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-slate-600">Loading products...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-lg">No products found</p>
            <p className="text-slate-500 text-sm mt-2">
              Click "Create Product" to add your first product
            </p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="flex flex-col gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="relative rounded-2xl bg-slate-50
                px-5 py-4 shadow hover:shadow-lg transition"
              >
                <div className="absolute top-3 right-4 text-xs text-slate-500">
                  🕒 {formatIST(p.createdAt)}
                </div>

                <h3 className="text-lg font-semibold capitalize">{p.name}</h3>

                <p className="text-sm text-slate-600 mt-1">
                  ₹{p.price} / {p.unit}
                </p>

                <p className="text-sm mt-2">
                  📦 Stock:{" "}
                  <b className={`ml-1 ${ isLowStock(p) ? 'text-red-600' : 'text-green-600' }`}>
                    {formatStock(p.stock, p.unit)}
                  </b>
                </p>

                <span
                  className={`inline-block mt-3 px-3 py-1 text-xs
                  font-semibold rounded-full ${ isLowStock(p)
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                    }`}
                >
                  {isLowStock(p) ? "LOW STOCK" : "IN STOCK"}
                </span>

                <div className="absolute right-4 bottom-4 flex gap-2">
                  <button
                    onClick={() => setEditProduct(p)}
                    className="px-3 py-1 text-sm bg-blue-100
                    text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p)}
                    className="px-3 py-1 text-sm bg-red-100
                    text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative max-w-sm sm:max-w-md w-full
        bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}