import { useEffect } from "react";

export function useKeepAlive(): void {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ping`)
        .then(() => console.log("✅ Keep-alive ping sent"))
        .catch((err) => console.error("❌ Keep-alive failed:", err));
    }, 7 * 60 * 1000); // every 7 minutes

    return () => clearInterval(interval);
  }, []);
}
