import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/pokemon-card-catalog/",
  plugins: [react()]
});
