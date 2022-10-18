import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useCountStore = defineStore("count", () => {
  const count = ref(0);
  const doubleCount = computed(() => {
    return count.value * 2;
  });
  const countAdd = () => {
    return count.value++;
  };

  return {
    count,
    doubleCount,
    countAdd,
  };
});
