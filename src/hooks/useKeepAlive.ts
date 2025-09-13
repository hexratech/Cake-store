// src/hooks/useKeepAlive.ts
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useKeepAlive = () => {
  useEffect(() => {
    // Check if the API URL is defined before starting the ping.
    if (!API_URL) {
      console.error("VITE_API_URL environment variable is not defined.");
      return;
    }

    // Set the ping interval to 7 minutes (7 * 60 * 1000 milliseconds).
    const intervalInMs = 21 * 60 * 1000;

    const pingBackend = () => {
      // Use a lightweight endpoint to avoid unnecessary processing.
      const pingUrl = `${API_URL}/api/products`;
      fetch(pingUrl)
        .then((res) => {
          if (res.ok) {
            console.log("Backend ping successful. Server is awake.");
          } else {
            console.error("Failed to ping backend:", res.statusText);
          }
        })
        .catch((err) => {
          console.error("Error during keep-alive ping:", err);
        });
    };

    // Start the first ping immediately, then set the interval.
    pingBackend();
    const intervalId = setInterval(pingBackend, intervalInMs);

    // Clean up the interval when the component unmounts to prevent memory leaks.
    return () => clearInterval(intervalId);
  }, []);
};