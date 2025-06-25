// lib/api.ts

export const api = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
};
