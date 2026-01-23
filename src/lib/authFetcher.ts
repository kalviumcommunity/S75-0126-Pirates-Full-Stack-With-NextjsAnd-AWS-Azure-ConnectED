import Cookies from "js-cookie";

export const authFetcher = async (url: string) => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
