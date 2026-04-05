import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import checker from "vite-plugin-checker";
import VueRouter from "vue-router/vite"; // ✅ Vue Router 5 内置文件路由

export default defineConfig({
  plugins: [
    // ⚠️ VueRouter 插件必须放在 Vue() 之前
    VueRouter({
      routesFolder: [
        { src: "src/modules", path: "", filePatterns: "**/pages/**/*.vue" },
      ],
      extensions: [".vue"],
      importMode: "async",
      dts: "src/route-map.d.ts",
    }),
    vue(),
    tailwindcss(),
    // ✅ 异步类型检查：后台运行，不阻塞 HMR
    checker({
      vueTsc: { tsconfigPath: "./tsconfig.json" },
      enableBuild: false,
      overlay: { initialIsOpen: false },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
