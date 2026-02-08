// // services/invoiceService.js
// import url from "../network/UrlProvider";
// import { toast } from "sonner";

// export const downloadInvoice = async (invoiceId) => {
//   // Show loading toast and save its ID
//   const toastId = toast.loading("Downloading invoice... 🧾");

//   try {
//     const res = await fetch(`${ url }/invoice/${ invoiceId }/download`, {
//       method: "GET",
//       credentials: "include",
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       toast.dismiss(toastId); // stop loading
//       toast.error("Invoice download failed ❌");
//       throw new Error(text || "Invoice download failed");
//     }

//     const blob = await res.blob();
//     const fileURL = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = fileURL;
//     a.download = `invoice-${ invoiceId }.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     window.URL.revokeObjectURL(fileURL);

//     // ✅ Stop loading and show success
//     toast.dismiss(toastId);
//     toast.success("Invoice downloaded successfully ✅");
//   } catch (error) {
//     // Stop loading and show error
//     toast.dismiss(toastId);
//     console.error(error);
//     toast.error(error.message || "Something went wrong");
//   }
// };
import { toast } from "sonner";
import url from "../network/UrlProvider";

export const downloadInvoice = async (invoiceId) => {
  const toastId = toast.loading("Downloading invoice... 🧾");
  try {
    const res = await fetch(`${ url }/invoice/${ invoiceId }/download`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      toast.dismiss(toastId);
      throw new Error("Invoice download failed ❌");
    }

    const blob = await res.blob();
    const fileURL = window.URL.createObjectURL(blob);

    //  Show invoice in new tab
    window.open(fileURL);

    //  Also trigger download
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `invoice-${ invoiceId }.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(fileURL);

    toast.dismiss(toastId);
    toast.success("Invoice downloaded & opened successfully ✅");
  } catch (error) {
    toast.dismiss(toastId);
    console.error(error);
    toast.error(error.message || "Something went wrong");
  }
};
