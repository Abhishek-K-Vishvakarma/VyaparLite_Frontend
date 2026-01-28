// components/products/AddProduct.jsx
export default function AddProduct() {
  return (
    <div className="bg-white rounded-xl border p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Add Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="input" placeholder="Product Name" />
        <input className="input" placeholder="Price" />
        <input className="input" placeholder="Stock" />
      </div>

      <button className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg">
        Save Product
      </button>
    </div>
  );
}
