import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    exclude: [
      ...configDefaults.exclude, 
      "**/testing-app/**"
    ]
  },
});
