// services/invoiceService.js
import url from "../network/UrlProvider";
import { toast } from "sonner";

export const downloadInvoice = async (invoiceId) => {
  try {
    toast.loading("Downloading invoice... 🧾");

    const res = await fetch(`${ url }/invoice/${ invoiceId }/download`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      toast.error("Invoice download failed ❌");
      throw new Error(text || "Invoice download failed");
    }

    const blob = await res.blob();
    const fileURL = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `invoice-${ invoiceId }.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(fileURL);

    toast.success("Invoice downloaded successfully ✅");

  } catch (error) {
    console.error(error);
    toast.error(error.message || "Something went wrong");
  }
};
