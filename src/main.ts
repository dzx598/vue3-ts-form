import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "vxe-table/lib/style.min.css";
import "cnhis-design-vue/es/components/index.css";
import VXETable from "vxe-table";

createApp(App).use(router).use(store).use(VXETable).mount("#app");
