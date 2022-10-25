<template>
  <div class="AppContent"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMessage, useDialog, useLoadingBar } from "naive-ui";

export default defineComponent({
  setup(props, { emit }) {
    //挂载在 window 方便与在js中使用
    window["$message"] = useMessage();
    window["message"] = useMessage();
    //挂载在 window 方便与在js中使用
    window["$dialog"] = useDialog();

    window["$loading"] = useLoadingBar();
  },
});
</script>

<style lang="less" scoped></style>
