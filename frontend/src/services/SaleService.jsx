// services/saleService.js
import url from "../network/UrlProvider";

export const createSale = async (payload) => {
  console.log("Payload :", payload);
  const res = await fetch(`${ url }/sale/create`, {
    method: "POST",
    credentials: "include", //  cookie auth
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data;
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
    console.log(data, payload);
  } else {
    const text = await res.text();
    throw new Error(text || "Unexpected server response");
  }

  if (!res.ok) {
    console.error("Create sale error:", data);
    throw new Error(data.message || "Sale creation failed");
  }

  return data;
};
