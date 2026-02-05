// services/invoiceService.js

export const downloadInvoice = async (invoiceId, token) => {
  const res = await fetch(`/api/invoice/${ invoiceId }/download`, {
    headers: {
      Authorization: `Bearer ${ token }`,
    },
  });

  if (!res.ok) {
    throw new Error("Invoice download failed");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${ invoiceId }.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};
