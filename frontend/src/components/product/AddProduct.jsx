import { useEffect, useState } from "react";

export default function AddProduct({ onClose, editData, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    unit: "PIECE",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        price: editData.price,
        stock: editData.stock,
        unit: editData.unit,
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editData
      ? `/api/product/put-product/${ editData._id }`
      : "/api/product/add";

    const method = editData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);

    onSuccess?.();
    onClose();
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4">
        {editData ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="PIECE">Piece</option>
          <option value="KG">KG</option>
        </select>

        <div className="flex justify-end gap-3 pt-3">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : editData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
