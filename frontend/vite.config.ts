import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { UserConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    {
      ...tailwindcss("./tailwind.config.js"),
      apply: "build",
      postcssConfig: false,
    },
  ],
} as UserConfig);
