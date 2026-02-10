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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true); // 🔥 start loader

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
    } finally {
      setIsSubmitting(false); // 🔥 stop loader
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-blue-600 tracking-wide">
            VyaparLite
          </p>
          <h2 className="text-xl font-bold text-slate-800">
            {editData ? "Edit Product" : "Add Product"}
          </h2>
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="e.g., Sugar, Dolo 650"
          className="w-full rounded-lg border border-slate-300
      px-3 py-2 text-sm
      transition focus:ring-2 focus:ring-blue-500
      focus:border-blue-500 hover:border-slate-400 outline-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Category
        </label>
        <select
          value={formData.category}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-slate-300
      px-3 py-2 text-sm bg-white
      transition focus:ring-2 focus:ring-blue-500
      focus:border-blue-500 hover:border-slate-400 outline-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          GST Rate: <span className="font-semibold">{selectedGST}%</span>
        </p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Price (per {formData.unit})
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          placeholder="e.g., 48"
          className="w-full rounded-lg border border-slate-300
      px-3 py-2 text-sm
      transition focus:ring-2 focus:ring-blue-500
      focus:border-blue-500 hover:border-slate-400 outline-none"
        />
      </div>

      {/* Unit */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Unit
        </label>
        <select
          value={formData.unit}
          onChange={(e) =>
            setFormData({ ...formData, unit: e.target.value })
          }
          className="w-full rounded-lg border border-slate-300
      px-3 py-2 text-sm bg-white
      transition focus:ring-2 focus:ring-blue-500
      focus:border-blue-500 hover:border-slate-400 outline-none"
        >
          <option value="KG">KG (Kilogram)</option>
          <option value="PIECE">PIECE</option>
          <option value="BOTTLE">BOTTLE</option>
          <option value="PACKET">PACKET</option>
        </select>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Stock ({formData.unit})
        </label>
        <input
          type="number"
          required
          min="0"
          step={formData.unit === "KG" ? "0.001" : "1"}
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          placeholder={
            formData.unit === "KG"
              ? "e.g., 50 (means 50 KG)"
              : "e.g., 100"
          }
          className="w-full rounded-lg border border-slate-300
      px-3 py-2 text-sm
      transition focus:ring-2 focus:ring-blue-500
      focus:border-blue-500 hover:border-slate-400 outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2
  py-2 rounded-lg font-medium shadow transition
  ${ isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white"
            }`}
        >
          {isSubmitting && (
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          )}

          {isSubmitting
            ? editData
              ? "Updating..."
              : "Adding..."
            : editData
              ? "Update Product"
              : "Add Product"}
        </button>
      </div>
    </form>

  );
}