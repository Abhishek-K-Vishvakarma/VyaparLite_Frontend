// components/products/AddProduct.jsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import url from "../../network/UrlProvider";

const CATEGORIES = [
  { value: "ESSENTIAL_FOOD", label: "Essential Food (0% GST)", gst: 0 },
  { value: "PROCESSED_FOOD", label: "Processed Food (5% GST)", gst: 5 },
  { value: "PACKED_FOOD", label: "Packed Food (12% GST)", gst: 12 },
  { value: "BEVERAGES", label: "Beverages (18% GST)", gst: 18 },
  { value: "MEDICINES", label: "Medicines (12% GST)", gst: 12 },
  { value: "MEDICAL_DEVICES", label: "Medical Devices (12% GST)", gst: 12 },
  { value: "COSMETICS", label: "Cosmetics (18% GST)", gst: 18 },
  { value: "ELECTRONICS", label: "Electronics (18% GST)", gst: 18 },
  { value: "MOBILE_PHONES", label: "Mobile Phones (18% GST)", gst: 18 },
  { value: "CLOTHING_BASIC", label: "Basic Clothing (5% GST)", gst: 5 },
  { value: "CLOTHING_PREMIUM", label: "Premium Clothing (12% GST)", gst: 12 },
  { value: "GENERAL", label: "General (18% GST)", gst: 18 },
];

export default function AddProduct({ editData, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "GENERAL",
    price: "",
    unit: "PIECE",
    stock: "",
  });

  const [selectedGST, setSelectedGST] = useState(18);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        category: editData.category || "GENERAL",
        price: editData.price || "",
        unit: editData.unit || "PIECE",
        stock: editData.stock || "",
      });
      setSelectedGST(editData.gstRate || 18);
    }
  }, [editData]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const categoryObj = CATEGORIES.find(c => c.value === category);

    setFormData({ ...formData, category });
    setSelectedGST(categoryObj?.gst || 18);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editData
        ? `${ url }/product/put-product/${ editData._id }`
        : `${ url }/product/add`;

      const method = editData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Product saved successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {editData ? "Edit Product" : "Add Product"}
      </h2>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., Sugar, Dolo 650"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={formData.category}
          onChange={handleCategoryChange}
          className="w-full border rounded px-3 py-2"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-600 mt-1">
          GST Rate: <span className="font-semibold">{selectedGST}%</span>
        </p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Price (per {formData.unit})
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., 48"
        />
      </div>

      {/* Unit */}
      <div>
        <label className="block text-sm font-medium mb-1">Unit</label>
        <select
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="KG">KG (Kilogram)</option>
          <option value="PIECE">PIECE</option>
          <option value="BOTTLE">BOTTLE</option>
          <option value="PACKET">PACKET</option>
        </select>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Stock ({formData.unit})
        </label>
        <input
          type="number"
          required
          min="0"
          step={formData.unit === "KG" ? "0.001" : "1"}
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="w-full border rounded px-3 py-2"
          placeholder={formData.unit === "KG" ? "e.g., 50 (means 50 KG)" : "e.g., 100"}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {editData ? "Update" : "Add"} Product
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}