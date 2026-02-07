// services/invoiceService.js
import url from "../network/UrlProvider";
export const downloadInvoice = async (invoiceId) => {
  console.log(invoiceId);
  const res = await fetch(`${ url }/invoice/${ invoiceId }/download`, {
    method: "GET",
    credentials: "include", //  cookie auth
  });

  if (!res.ok) {
    const text = await res.text();
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
};
