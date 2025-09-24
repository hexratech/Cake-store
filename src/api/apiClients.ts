// src/api/apiClient.ts

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("❌ Missing VITE_API_URL. Please set it in your .env file (local) or in Netlify environment variables.");
}

export const fetchData = async () => {
  try {
    const res = await fetch(`${API_URL}/api/some-endpoint`);

    if (!res.ok) {
      throw new Error(`❌ API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};
