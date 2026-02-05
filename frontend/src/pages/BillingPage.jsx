import { useEffect, useState } from "react";
import axios from "axios";
import ProductSearch from "../components/billing/ProductSearch";
import BillTable from "../components/billing/BillTable";
import BillSummary from "../components/billing/BillSummary";
import { calculateAmount } from "../utils/Calc";
import { createSale } from "../services/saleService";
import { downloadInvoice } from "../services/invoiceService";

export default function BillingPage({ token }) {
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);

  useEffect(() => {
    axios
      .get("/api/product/my-products", {
        headers: {
          Authorization: `Bearer ${ token }`,
        },
      })
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [token]);

  const addProduct = (product, qty) => {
    const amount = calculateAmount(product.price, product.unit, qty);
    const exists = billItems.find((i) => i._id === product._id);

    if (exists) {
      const newQty = exists.qty + qty;
      setBillItems(
        billItems.map((item) =>
          item._id === product._id
            ? {
              ...item,
              qty: newQty,
              amount: calculateAmount(item.price, item.unit, newQty),
            }
            : item
        )
      );
    } else {
      setBillItems([
        ...billItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          qty,
          amount,
        },
      ]);
    }
  };

  const updateQty = (id, qty) => {
    setBillItems(
      billItems.map((item) =>
        item._id === id
          ? {
            ...item,
            qty,
            amount: calculateAmount(item.price, item.unit, qty),
          }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setBillItems(billItems.filter((i) => i._id !== id));
  };

  const handleGenerateInvoice = async () => {
    if (!billItems.length) {
      alert("No items in bill");
      return;
    }

    try {
      const payload = {
        paymentMethod: "CASH",
        items: billItems.map((item) => ({
          product: item._id,
          quantity: item.qty,
        })),
      };

      const res = await createSale(payload, token);
      const invoiceId = res.invoice._id;

      await downloadInvoice(invoiceId, token);

      setBillItems([]); // clear bill after success
    } catch (err) {
      console.error(err);
      alert("Invoice generation failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Billing / POS</h1>

      <ProductSearch products={products} onAdd={addProduct} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BillTable
          items={billItems}
          onQtyChange={updateQty}
          onRemove={removeItem}
        />

        <BillSummary items={billItems} />

        <button
          onClick={handleGenerateInvoice}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
}
