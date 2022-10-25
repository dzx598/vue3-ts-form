import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "vxe-table/lib/style.min.css";
import "cnhis-design-vue/es/components/index.css";
import _ from 'lodash'
import VXETable from "vxe-table";
const app =  createApp(App)


app.config.globalProperties.foo = 'bar'
app.use(router).use(store).use(VXETable).mount("#app");
