// services/saleService.js
import url from "../network/UrlProvider";
import { toast } from "sonner";

export const createSale = async (payload) => {
  try {
    toast.loading("Creating sale... 🧾");

    const res = await fetch(`${ url }/sale/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(text || "Unexpected server response");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Sale creation failed");
    }

    toast.success("Sale created successfully ✅");
    return data;

  } catch (error) {
    console.error("Create sale error:", error);
    toast.error(error.message || "Sale creation failed ❌");
    throw error;
  }
};
