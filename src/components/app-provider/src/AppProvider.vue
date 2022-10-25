<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <app-content />
          <!-- <slot slot="default"></slot> -->
          <n-spin description="加载中......" style="height: 100%" :show="store.loading">
            <slot></slot>
          </n-spin>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppContent from "./AppContent.vue";
import { globalStore } from "@/store";

export default defineComponent({
  components: {
    AppContent,
  },
  setup(props, { emit }) {
    const store = globalStore();
    
    return {
      store,
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.n-spin-container) {
  height: 100%;
}
:deep(.n-spin-content) {
  height: 100%;
}
</style>
