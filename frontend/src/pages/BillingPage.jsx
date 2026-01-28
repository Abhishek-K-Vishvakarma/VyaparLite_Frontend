import { useState } from "react";
import ProductSearch from "../components/billing/ProductSearch";
import BillTable from "../components/billing/BillTable";
import BillSummary from "../components/billing/BillSummary";

const products = [
  { id: 1, name: "Sugar", price: 45 },
  { id: 2, name: "Rice", price: 60 },
  { id: 3, name: "Oil", price: 120 },
  { id: 4, name: "Tea", price: 90 },
];

export default function BillingPage() {
  const [billItems, setBillItems] = useState([]);

  const addProduct = (product) => {
    const exists = billItems.find((i) => i.id === product.id);

    if (exists) {
      setBillItems(
        billItems.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setBillItems([...billItems, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setBillItems(
      billItems.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const removeItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">

      <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
        Billing / POS
      </h1>

      <ProductSearch products={products} onAdd={addProduct} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BillTable
          items={billItems}
          onQtyChange={updateQty}
          onRemove={removeItem}
        />

        <BillSummary items={billItems} />
      </div>

    </div>
  );
}
