// services/saleService.js

export const createSale = async (payload, token) => {
  const res = await fetch("/api/sale/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ token }`,
    },
    body: JSON.stringify(payload),
  });

  // 🔴 Handle 400 / 401 / 500 properly
  const data = await res.json();

  if (!res.ok) {
    console.error("Create sale error:", data);
    throw new Error(data.message || "Sale creation failed");
  }

  return data;
};
