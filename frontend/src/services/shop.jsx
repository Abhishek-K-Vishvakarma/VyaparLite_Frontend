import { useEffect, useState } from "react";
import url from "../network/UrlProvider";
export default function MyShop() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    type: "",
    gstin: ""
  });

  // ================= FETCH SHOPS =================
  const fetchMyShops = async () => {
    try {
      const res = await fetch(`${url}/shop/my/shop`, {
        credentials: "include"
      });
      const data = await res.json();
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyShops();
  }, []);

  // ================= CREATE SHOP =================
  const createShop = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${url}/shop/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Create failed");

      setShowModal(false);
      setForm({
        name: "",
        address: "",
        phone: "",
        type: "",
        gstin: ""
      });

      fetchMyShops(); // refresh list
    } catch (err) {
      alert("Shop creation failed");
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Shops</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Create Shop
        </button>
      </div>

      {/* Shop Cards */}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : shops.length === 0 ? (
        <p className="text-slate-400">No shops found</p>
      ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shops.map((shop) => (
                <div
                  key={shop._id}
                  className="relative overflow-hidden rounded-2xl p-6
      bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617]
      text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]
      hover:-translate-y-1 hover:shadow-indigo-500/30
      transition-all duration-300"
                >
                  {/* Gradient Accent */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent pointer-events-none" />

                  {/* Chip */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90" />
                    <span className="text-xs tracking-widest text-slate-300 uppercase">
                      Vyapar Lite
                    </span>
                  </div>

                  {/* Shop Info */}
                  <div className="mt-6">
                    <h2 className="text-2xl font-semibold tracking-wide">
                      {shop.name}
                    </h2>
                    <p className="text-sm text-indigo-400 mt-1">
                      {shop.type} Store
                    </p>
                  </div>

                  {/* Details */}
                  <div className="mt-6 text-sm space-y-2 text-slate-300">
                    <p className="flex items-center gap-2">
                      <span>📍</span> {shop.address || "—"}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📞</span> {shop.phone || "—"}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs tracking-widest text-slate-400">
                      GSTIN • {shop.gstin || "N/A"}
                    </p>
                    <span className="text-xs uppercase tracking-widest text-slate-400">
                      ACTIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <>
          {/* Fade background */}
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Create New Shop
            </h2>

            <form onSubmit={createShop} className="space-y-3">
              <input
                placeholder="Shop Name"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Address"
                className="w-full border p-2 rounded"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                required
              />
              <input
                placeholder="Phone"
                className="w-full border p-2 rounded"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />
              <input
                placeholder="Type (Medical, Mobile, etc)"
                className="w-full border p-2 rounded"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                required
              />
              <input
                placeholder="GSTIN"
                className="w-full border p-2 rounded"
                value={form.gstin}
                onChange={(e) =>
                  setForm({ ...form, gstin: e.target.value })
                }
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
