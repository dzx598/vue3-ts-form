import { defineStore, createPinia } from "pinia";
import type { App } from "vue";
import { useCountStore } from "./modules/count";
import { useHomeStore } from './modules/home'
const store = createPinia();
export const globalStore = defineStore({
    id: "global",
    state: () => ({
      loading: false,
    }),
    getters: {
      getLoading: state => state.loading,
    },
    actions: {
      setLoading(val: boolean) {
        this.loading = val;
      },
    },

  });
export function setupStore(app: App<Element>) {
    app.use(store);
}
export default store;
export { useCountStore,useHomeStore};
