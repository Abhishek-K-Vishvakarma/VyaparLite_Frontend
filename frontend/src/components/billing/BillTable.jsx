export default function BillTable({ items, onQtyChange, onRemove }) {
  const UNIT_LABEL = {
    KG: "kg",
    PIECE: "pcs",
    PACKET: "pkt",
    BOTTLE: "bottle",
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-3">Bill Items</h2>

      {items.length === 0 && (
        <p className="text-sm text-slate-500">No items added</p>
      )}

      {items.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center py-2 border-b last:border-b-0"
        >
          {/* Product Info */}
          <div className="w-40">
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-slate-500">
              ₹{item.price} / {UNIT_LABEL[item.unit]}
            </p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={item.unit === "KG" ? 10 : 1}
              step={item.unit === "KG" ? 10 : 1}
              value={item.qty}
              onChange={(e) => {
                const value = Number(e.target.value) || 0;
                onQtyChange(item._id, value);
              }}
              className="w-24 border rounded px-2 py-1"
              placeholder={item.unit === "KG" ? "grams" : "qty"}
            />

            <span className="text-sm text-slate-600">
              {item.unit === "KG" ? "gm" : UNIT_LABEL[item.unit]}
            </span>
          </div>

          {/* Amount */}
          <p className="font-semibold w-24 text-right">
            ₹{(item.amount || 0).toFixed(2)}
          </p>

          {/* Remove */}
          <button
            onClick={() => onRemove(item._id)}
            className="text-red-600 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
