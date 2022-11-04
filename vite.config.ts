import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import compresssionBuild from "rollup-plugin-compression";
import { createStyleImportPlugin } from "vite-plugin-style-import";
import type { ICompressionOptions } from "rollup-plugin-compression";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dayjs from "dayjs";
import path from "path";
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from "path";
// https://vitejs.dev/config/
const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
const option: ICompressionOptions = {
  sourceName: `dist`,
  type: "zip",
  targetName: `dist-${time}.zip`,
};
export default defineConfig({
  plugins: [
    vue(),

    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
        },
      ],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [NaiveUiResolver(), ElementPlusResolver()],
    }),
    vueJsx(),
    compresssionBuild,
    createStyleImportPlugin({
      libs: [
        {
          libraryName: "cnhis-design-vue",
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: name => {
            return `cnhis-design-vue/es/components/${name.slice(2)}/style/index.css`;
          },
        },
      ],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
    },
    extensions: [".js", ".ts", ".vue", ".json", ".mjs"],
  },
  base: "./", // 设置打包路径
  server: {
    port: 3030, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域

    // 设置代理，根据我们项目实际情况配置
    // proxy: {
    //   '/api': {
    //     target: 'http://xxx.xxx.xxx.xxx:8000',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace('/api/', '/')
    //   }
    // }
  },
  build: {
    sourcemap: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    reportCompressedSize: false,
    rollupOptions: {
      // ..otherOptions
      output: {
        dir: "./dist",
        manualChunks(id: string) {
          if (id.includes("node_modules") && !id.includes("cnhis-design-vue")) {
            return "vendor";
          }
        },
      },
    },
  },
});
