import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
// import checker from "vite-plugin-checker";
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
    // 禁用 vite-plugin-checker 以提升开发体验
    // 需要类型检查时手动运行 npm run type-check
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
