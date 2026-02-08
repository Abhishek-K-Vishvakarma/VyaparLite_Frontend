import { useEffect, useState } from "react";
import axios from "axios";
import ProductSearch from "../components/billing/ProductSearch";
import BillTable from "../components/billing/BillTable";
import BillSummary from "../components/billing/BillSummary";
import { calculateAmount } from "../utils/Calc";
import { createSale } from "../services/SaleService";
import { downloadInvoice } from "../services/InvoiceService";
import url from "../network/UrlProvider";
import { toast } from "sonner";

export default function BillingPage({ token }) {
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);

  useEffect(() => {
    axios.get(`${ url }/product/my-products`, {
      withCredentials: true
    })
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [token]);

  const addProduct = (product, qty) => {
    const amount = calculateAmount(product.price, product.unit, qty);
    const exists = billItems.find((i) => i._id === product._id);

    if (exists) {
      const newQty = exists.qty + qty;
      const newKg = product.unit === "KG" ? Math.floor(newQty) : 0;
      const newGrams = product.unit === "KG" ? Math.round((newQty % 1) * 1000) : 0;

      setBillItems(
        billItems.map((item) =>
          item._id === product._id
            ? {
              ...item,
              qty: newQty,
              kg: newKg,
              grams: newGrams,
              amount: calculateAmount(item.price, item.unit, newQty),
            }
            : item
        )
      );
    } else {
      const kg = product.unit === "KG" ? Math.floor(qty) : 0;
      const grams = product.unit === "KG" ? Math.round((qty % 1) * 1000) : 0;

      setBillItems([
        ...billItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          qty,
          kg,
          grams,
          amount,
        },
      ]);
    }
  };

  const updateQty = (id, totalQty, kg = null, grams = null) => {
    setBillItems(
      billItems.map((item) =>
        item._id === id
          ? {
            ...item,
            qty: totalQty,
            kg: kg !== null ? Number(kg) : item.kg || 0,
            grams: grams !== null ? Number(grams) : item.grams || 0,
            amount: calculateAmount(item.price, item.unit, totalQty),
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
      toast.error("No items in bill");
      return;
    }

    try {
      const payload = {
        paymentMethod: "CASH",
        items: billItems.map((item) => ({
          product: item._id,
          quantity: item.qty, // This is the total in base unit (1.5 for 1kg 500g)
        })),
      };

      const res = await createSale(payload, token);
      const invoiceId = res.invoice._id;

      await downloadInvoice(invoiceId, token);

      setBillItems([]); // clear bill after success

      // Refresh products to show updated stock
      axios.get(`${ url }/product/my-products`, {
        withCredentials: true
      })
        .then((res) => setProducts(res.data))
        .catch(console.error);

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invoice generation failed");
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
      </div>

      <button
        onClick={handleGenerateInvoice}
        className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition"
      >
        Generate Invoice
      </button>
    </div>
  );
}