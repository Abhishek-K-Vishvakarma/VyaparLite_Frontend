import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AddProduct from "./AddProduct";
import url from "../../network/UrlProvider";

const formatStock = (stock, unit) => {
  if (unit === "KG") return `${ stock / 1000 } KG`;
  return `${ stock } ${ unit }`;
};

const isLowStock = (p) => {
  const limits = {
    KG: 5,
    PIECE: 5,
    BOTTLE: 5,
    PACKET: 5,
  };

  if (p.unit === "KG") return p.stock / 1000 <= limits.KG;
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
      toast.error("Failed to fetch products", {err});
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

    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${ url }/product/del-product/${ p._id }`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
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

          {lowStockProducts.map((p) => (
            <div
              key={p._id}
              className="mb-3 rounded-xl border-l-4 border-red-500
              bg-red-50 px-4 py-3"
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm">
                Stock: {formatStock(p.stock, p.unit)}
              </p>
            </div>
          ))}
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
                text-sm font-semibold text-red-700 hover:bg-red-200"
              >
                ⚠️ Low Stock ({lowStockProducts.length})
              </button>
            )}

            <button
              onClick={() => setCreate(true)}
              className="bg-blue-600 text-white px-4 py-2
              rounded-lg hover:bg-blue-700"
            >
              + Create Product
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading && <p className="text-center">Loading...</p>}

        {!loading && products.length === 0 && (
          <p className="text-center text-slate-400">
            No products found
          </p>
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

                <h3 className="text-lg font-semibold">{p.name}</h3>

                <p className="text-sm text-slate-600">
                  ₹{p.price} / {p.unit}
                </p>

                <p className="text-sm mt-1">
                  📦 Stock:
                  <b className="ml-1">
                    {formatStock(p.stock, p.unit)}
                  </b>
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs
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
                    text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p)}
                    className="px-3 py-1 text-sm bg-red-100
                    text-red-700 rounded-lg hover:bg-red-200"
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
        className="relative max-w-sm sm:max-w-md
        bg-white rounded-2xl shadow-2xl p-5"
      >
        {children}
      </div>
    </div>
  );
}
