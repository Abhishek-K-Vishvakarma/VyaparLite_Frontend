import { useEffect, useState } from "react";
import AddProduct from "./AddProduct";
import url from "../../network/UrlProvider";

/* ================= HELPERS ================= */

const formatStock = (stock, unit) => {
  if (unit === "KG") return `${ stock / 1000 } KG`;
  if (unit === "GRAM") return `${ stock } GM`;
  return `${ stock } ${ unit }`;
};

const isLowStock = (p) => {
  const limits = {
    KG: 5,
    GRAM: 500,
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

/* ================= COMPONENT ================= */

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

      const res = await fetch(`${url}/product/my-products`, {
        credentials: "include",
      });

      const data = await res.json();

      // GUARANTEE ARRAY
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (p) => {
    if (p.stock > 0) {
      alert("❌ Set stock to 0 before deleting");
      return;
    }

    if (!window.confirm("Delete this product?")) return;

    const res = await fetch(`${url}/product/del-product/${ p._id }`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    alert(data.message);
    fetchProducts();
  };

  const lowStockProducts = Array.isArray(products)
    ? products.filter(isLowStock)
    : [];


  return (
    <div className="relative">
      {/* ================= CREATE MODAL ================= */}
      {create && (
        <Modal onClose={() => setCreate(false)}>
          <AddProduct
            onClose={() => setCreate(false)}
            onSuccess={fetchProducts}
          />
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <Modal onClose={() => setEditProduct(null)}>
          <AddProduct
            editData={editProduct}
            onClose={() => setEditProduct(null)}
            onSuccess={fetchProducts}
          />
        </Modal>
      )}

      {/* ================= LOW STOCK MODAL ================= */}
      {showLowStock && (
        <Modal onClose={() => setShowLowStock(false)}>
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            ⚠️ Low Stock Products
          </h2>

          {lowStockProducts.map((p) => (
            <div
              key={p._id}
              className="mb-3 rounded-xl border-l-4 border-red-500
              bg-red-50 px-4 py-3 shadow-sm"
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm">
                Stock: {formatStock(p.stock, p.unit)}
              </p>
            </div>
          ))}
        </Modal>
      )}

      {/* ================= MAIN ================= */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Product List</h2>

          <div className="flex gap-3 items-center">
            {lowStockProducts.length > 0 && (
              <button
                onClick={() => setShowLowStock(true)}
                className="rounded-full bg-red-100 px-4 py-2
                text-sm font-semibold text-red-700
                hover:bg-red-200 animate-pulse"
              >
                ⚠️ Low Stock ({lowStockProducts.length})
              </button>
            )}

            <button
              onClick={() => setCreate(true)}
              className="bg-blue-600 text-white px-4 py-2
              rounded-md hover:bg-blue-700"
            >
              + Create Product
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && <p className="text-center">Loading...</p>}

        {/* PRODUCT LIST */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="group relative rounded-2xl bg-gradient-to-br
                from-white to-slate-50 px-6 py-5 shadow-md
                hover:shadow-2xl transition-all duration-300
                hover:-translate-y-1"
              >
                {/* DATE */}
                <div className="absolute top-3 right-4 text-xs text-slate-500">
                  🕒 {formatIST(p.createdAt)}
                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  {p.name}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  ₹{p.price} / {p.unit}
                </p>

                <p className="mt-1 text-sm">
                  📦 Stock:
                  <b className="ml-1">
                    {formatStock(p.stock, p.unit)}
                  </b>
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1
                  text-xs font-semibold rounded-full
                  ${ isLowStock(p)
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                    }`}
                >
                  {isLowStock(p) ? "LOW STOCK" : "IN STOCK"}
                </span>

                {/* ACTIONS */}
                <div
                  className="absolute right-4 bottom-4 flex gap-2
                  opacity-0 group-hover:opacity-100 transition"
                >
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

        {!loading && products.length === 0 && (
          <p className="text-center text-slate-400">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-3xl bg-white rounded-2xl p-6">
        {children}
      </div>
    </div>
  );
}
