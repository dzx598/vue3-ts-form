import { createApp } from "vue"; //每个vue应用都是通过creatAPP函数创建的一个应用实例，每个应用都需要一个“根组件”，其他组件将作为其子组件。
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "vxe-table/lib/style.min.css";
import "cnhis-design-vue/es/components/index.css";
import _ from "lodash";
import VXETable from "vxe-table";
import BasicForm from "@/components/basic-form/index";
const app = createApp(App); //应用实例并不只限于一个,每个应用都拥有自己的用于配置和全局资源的作用域
app.component("BasicForm", BasicForm);
app.config.globalProperties.foo = "bar";
app.use(router).use(store).use(VXETable).mount("#app"); //应用实例必须在调用了 .mount() 方法后才会渲染出来，应用根组件的内容将会被渲染在容器元素div里面
