import { Trash2 } from "lucide-react";

export default function BillTable({ items, onQtyChange, onRemove }) {
  return (
    <div className="lg:col-span-2 bg-white border rounded-xl p-4">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">
        Bill Items
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">
          No items added
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-slate-500 border-b">
            <tr>
              <th className="text-left py-2">Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      onQtyChange(item.id, Number(e.target.value))
                    }
                    className="w-14 border rounded text-center"
                  />
                </td>
                <td className="text-center">₹{item.price}</td>
                <td className="text-center">
                  ₹{item.qty * item.price}
                </td>
                <td className="text-right">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
