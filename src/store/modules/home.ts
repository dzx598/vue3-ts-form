import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
export const useHomeStore = defineStore("home", () => {
  const home = reactive({
    dilalog: false,
    theme: null, // 主题
    tabActive: 0, // 门诊
    user: {},
    date: null,
  });
  const doubleDate = computed(() => {
    return new Date(0);
  });

  return {
    home,
    doubleDate,
  };
});
