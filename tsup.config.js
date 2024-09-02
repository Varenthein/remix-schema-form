// tsup.config.js
import { defineConfig } from "tsup";

export default defineConfig({
  "loader": {
    ".css": "local-css"
  },
});