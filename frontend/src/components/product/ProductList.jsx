// components/products/ProductList.jsx
export default function ProductList() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-semibold mb-4">Product List</h2>

      <table className="w-full text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="text-left py-2">Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-2">Sugar</td>
            <td className="text-center">₹45</td>
            <td className="text-center">12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
