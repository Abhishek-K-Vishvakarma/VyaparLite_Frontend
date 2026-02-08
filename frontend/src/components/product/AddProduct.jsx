import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import url from "../../network/UrlProvider";

export default function AddProduct({ onClose, editData, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    unit: "PIECE",
  });

  const [loading, setLoading] = useState(false);

  //  Edit mode: set EXACT saved values (no conversion)
  useEffect(() => {
    if (editData) {
      let displayStock = editData.stock;
      if (editData.unit === "KG") {
        displayStock = editData.stock / 1000;
      }
      setForm({
        name: editData.name,
        price: editData.price,
        stock: displayStock,   // FIX
        unit: editData.unit,
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = editData
        ? `${ url }/product/put-product/${ editData._id }`
        : `${ url }/product/add`;

      const method = editData ? "PUT" : "POST";

      const res = await fetch(apiUrl, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock), // ✅ ensure number
          price: Number(form.price),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message);

      toast.success(
        editData ? "Product updated successfully" : "Product added successfully"
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="w-full max-w-sm bg-white rounded-2xl p-6">
        {/* Branding */}
        <p className="text-xs font-semibold text-blue-600 mb-1">
          VyaparLite
        </p>

        <h2 className="text-lg font-bold mb-4">
          {editData ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Product Name">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sugar"
            />
          </Field>

          <Field label="Price">
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 50"
            />
          </Field>

          <Field label="Stock Quantity">
            <Input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="e.g. 20"
            />
          </Field>

          <Field label="Unit">
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
              hover:border-blue-400 transition"
            >
              <option value="KG">KG</option>
              <option value="PIECE">Piece</option>
              <option value="BOTTLE">Bottle</option>
              <option value="PACKET">Packet</option>
            </select>
          </Field>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editData
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* 🔹 Field Wrapper with Label */
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

/* 🔹 Reusable Input */
function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      {...props}
      required
      className="w-full px-4 py-3 rounded-xl border border-slate-300
      focus:outline-none focus:ring-2 focus:ring-blue-500
      hover:border-blue-400 transition"
    />
  );
}
