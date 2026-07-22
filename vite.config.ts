import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { Plugin } from "vite";

function stripTanStackStartSourceMap(): Plugin {
  return {
    name: "strip-tanstack-start-source-map",
    enforce: "post",
    transform(code, id) {
      if (!id.includes("@tanstack/start-client-core/dist/esm")) return;
      if (!code.includes("sourceMappingURL")) return;
      return code.replace(/\/\/#[ \t]*sourceMappingURL=.*$/gm, "");
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
      spa: { enabled: true },
    }),
    viteReact(),
    tailwindcss(),
    tsconfigPaths(),
    stripTanStackStartSourceMap(),
  ],
});
