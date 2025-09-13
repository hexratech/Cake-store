// src/api/apiClient.ts
const API_URL = import.meta.env.VITE_API_URL;

export const fetchData = async () => {
    const res = await fetch(`${API_URL}/api/some-endpoint`);
    return res.json();
};
