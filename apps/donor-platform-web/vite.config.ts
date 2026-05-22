import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars if you need them for “other things too”
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Port specifically
    server: {
      port: 5175,
    },

    // Optional “other things too”
    preview: {
      port: 5175,
      strictPort: true,
    },

    // If you want to expose a base path from env (example)
    // base: env.VITE_BASE_PATH ? env.VITE_BASE_PATH : "/",
    // define: { __APP_ENV__: JSON.stringify(env.APP_ENV) },
  };
});