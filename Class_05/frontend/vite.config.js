import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change the proxy target if your Express server runs on a different port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});