<template>
  <div>
    <n-form ref="formRef" :label-width="80" :model="curryConfig" :rules="rules">
      <n-form-item label="名称" path="label">
        <n-input v-model:value="curryConfig.label" placeholder="输入名称" />
      </n-form-item>
      <n-form-item label="宽度" path="width">
        <n-select v-model:value="curryConfig.width" :options="widthOptions" />
      </n-form-item>
      <n-form-item label="字段名" path="title">
        <n-input v-model:value="curryConfig.title" placeholder="输入字段名" />
      </n-form-item>

      <template v-if="curryConfig.type == 'select'">
        <n-form-item label="选项值" path="options">
          <n-input v-model:value="curryConfig.options" placeholder="输入options字段" />
        </n-form-item>
      </template>
      <n-form-item label="必填" path="require">
        <n-switch v-model:value="curryConfig.require">
          <template #checked :value="1">必填</template>
          <template #unchecked :value="0">非必填</template>
        </n-switch>
      </n-form-item>
      <n-form-item label="是否禁用" path="disabled">
        <n-switch v-model:value="curryConfig.disabled">
          <template #checked :value="true">是</template>
          <template #unchecked :value="false">否</template>
        </n-switch>
      </n-form-item>
    </n-form>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { content } from "../index";
const props = defineProps({
  curryConfig: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["update:curryConfig"]);
const formValue = ref<content>({
  label: "",
  width: "",
  fileId: "",
});
const rules = {
  label: {
    required: true,
    message: "请输入标题",
    trigger: "blur",
  },
  width: {
    required: true,
    message: "请输入宽度",
    type: "number",
    trigger: ["input", "blur"],
  },
};
const widthOptions = [
  {
    label: "整行",
    value: 24,
  },
  {
    label: "半行",
    value: 12,
  },
  {
    label: "三分之一",
    value: 8,
  },
  {
    label: "四分之一",
    value: 6,
  },
];
const requireOptions = [
  {
    label: "是",
    value: 1,
  },
  {
    label: "否",
    value: 0,
  },
];
watch(
  () => props.curryConfig,
  newVal => {
    console.log(newVal, "newVal**");
  }
);
</script>

<style lang="less" scoped></style>
