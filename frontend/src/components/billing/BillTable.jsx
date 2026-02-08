export default function BillTable({ items, onQtyChange, onRemove }) {
  const UNIT_LABEL = {
    KG: "kg",
    PIECE: "pcs",
    PACKET: "pkt",
    BOTTLE: "bottle",
  };

  const handleKgChange = (item, kg) => {
    const kgValue = Number(kg) || 0;
    const gramsValue = item.grams || 0;
    const totalQty = kgValue + gramsValue / 1000;
    onQtyChange(item._id, totalQty, kgValue, gramsValue);
  };

  const handleGramsChange = (item, grams) => {
    const gramsValue = Number(grams) || 0;
    const kgValue = item.kg || 0;
    const totalQty = kgValue + gramsValue / 1000;
    onQtyChange(item._id, totalQty, kgValue, gramsValue);
  };

  const handleNonKgChange = (item, qty) => {
    const newQty = Number(qty) || 1;
    onQtyChange(item._id, newQty);
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-3">Bill Items</h2>

      {items.length === 0 && (
        <p className="text-sm text-slate-500">No items added</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center py-3 px-2 border-b last:border-b-0 hover:bg-slate-50 rounded"
          >
            {/* Product Info */}
            <div className="w-40">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-slate-500">
                ₹{item.price} / {UNIT_LABEL[item.unit]}
              </p>
            </div>

            {/* Quantity Input */}
            <div className="flex items-center gap-2">
              {item.unit === "KG" ? (
                <>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={item.kg || 0}
                      onChange={(e) => handleKgChange(item, e.target.value)}
                      className="w-16 border rounded px-2 py-1 text-sm text-center"
                      placeholder="0"
                    />
                    <span className="text-xs text-slate-600">kg</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={999}
                      step={50}
                      value={item.grams || 0}
                      onChange={(e) => handleGramsChange(item, e.target.value)}
                      className="w-16 border rounded px-2 py-1 text-sm text-center"
                      placeholder="0"
                    />
                    <span className="text-xs text-slate-600">g</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={item.qty}
                    onChange={(e) => handleNonKgChange(item, e.target.value)}
                    className="w-20 border rounded px-2 py-1 text-sm text-center"
                    placeholder="1"
                  />
                  <span className="text-xs text-slate-600">
                    {UNIT_LABEL[item.unit]}
                  </span>
                </div>
              )}
            </div>

            {/* Amount */}
            <p className="font-semibold w-24 text-right text-sm">
              ₹{(item.amount || 0).toFixed(2)}
            </p>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item._id)}
              className="text-red-600 text-xs hover:underline hover:text-red-700 px-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}