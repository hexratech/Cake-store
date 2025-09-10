// src/services/keepAliveService.ts

const API_URL = import.meta.env.VITE_API_URL;

export const startKeepAlive = () => {
  // Ping the backend every 7 minutes (7 * 60 * 1000 milliseconds)
  const interval = 7 * 60 * 1000;

  // Use a simple, lightweight endpoint to avoid unnecessary processing
  const pingUrl = `${API_URL}/api/custom-cakes`;

  setInterval(() => {
    fetch(pingUrl)
      .then((res) => {
        if (res.ok) {
          console.log("Backend pinged successfully. Server is awake.");
        } else {
          console.error("Failed to ping backend.");
        }
      })
      .catch((err) => {
        console.error("Error during keep-alive ping:", err);
      });
  }, interval);
};