<template>
  <div class="SelectRepeat">
    <n-popover
      popper-class="sample-el-popover"
      placement="bottom"
      trigger="click"
      :show-arrow="false"
      width="trigger"
      @update:show="popoverHandle($event)"
    >
      <n-card class="box-card" :body-style="{ padding: '0' }" shadow="never" :content-style="cardContentStyle">
        <n-input v-model="keyword" placeholder="请输入搜索内容" class="box-card-search" @update:value="repeatInputChange"></n-input>
        <div class="box-card-list">
          <div v-for="(option, index) in filterOptions" :key="index" class="repeat-option" @click="addTagHandle(option)">
            {{ option.label }}
          </div>
        </div>
      </n-card>
      <template #trigger>
        <div v-if="!value || value.length == 0" class="repeat-input">
          <span class="placeholder">请选择</span>
        </div>
        <div v-else class="repeat-tag-box">
          <n-tag v-for="(tag, index) in selectList" :key="index" closable @close="delTagHandle(tag, index)">
            {{ tag.label }}
          </n-tag>
        </div>
      </template>
    </n-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType } from "vue";

const props = defineProps({
  value: {
    type: [Array, String],
    default: () => null,
  },
  placeholder: {
    type: String,
    default: "请选择",
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const emit = defineEmits(["update:value"]);

const cardContentStyle = {
  padding: "10px",
};
let keyword = ref("");
let options = ref<any[]>([]);
let filterOptions = ref<any[]>([]);
let selectList = ref<any[]>([]); // 已经选择的数据

const popoverHandle = (value: boolean) => {
  console.log(value);
  // selectList 中的 数据 要和 value字段同步
  if (!props.value || (Array.isArray(props.value) && props.value.length == 0)) {
    selectList.value = [];
    keyword.value = "";
  }
  // props.options.options;
  if (value && props.options) {
    options.value = props.options;
    filterOptions.value = props.options;
  }
};

const repeatInputChange = (value: any) => {
  // console.log(value);
  if (!value) {
    filterOptions.value = options.value;
    return;
  }
  filterOptions.value = options.value.filter(ele => {
    return ele.label.includes(value);
  });
};

const addTagHandle = (option: any) => {
  tagHandle("add", option);
};

const tagHandle = (type: "add" | "del", option: any, delIndex?: number) => {
  // let modelValue = props.modelValue;
  let tempArr = JSON.parse(JSON.stringify(props.value));
  if (!Array.isArray(tempArr)) {
    console.log("不是数据====");
    tempArr = [];
  }

  if (type == "add") {
    selectList.value.push(option);
    tempArr.push(option.value);
  } else if (type == "del") {
    if (delIndex != undefined) {
      selectList.value.splice(delIndex, 1);
      tempArr.splice(delIndex, 1);
    }
  }

  // let temp = { [item.field]: tempArr };
  // Object.assign(modelValue, temp);
  emit("update:value", tempArr);
};

const delTagHandle = (tag: any, index: number) => {
  // console.log(index, "===");
  tagHandle("del", tag, index);
};
</script>

<style lang="less" scoped>
.box-card-list {
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
}
:deep(.box-card-list .repeat-option) {
  padding: 5px 4px;
  border-radius: 2px;
}
:deep(.box-card-list .repeat-option:hover) {
  background-color: rgb(243, 243, 245); // rgb(243, 243, 245)  rgb(239, 239, 245)
  cursor: pointer;
}
.SelectRepeat {
  width: 100%;
  box-sizing: border-box;
  .repeat-input {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    border: 1px solid #dedede;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    .placeholder {
      color: rgba(194, 194, 194, 1);
    }
  }
  .repeat-tag-box {
    box-sizing: border-box;
    min-height: 32px;
    width: 100%;
    border: 1px solid #dedede;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 10px;
    padding-top: 2px;
    .n-tag {
      margin-right: 5px;
      margin-bottom: 2px;
    }
  }
  .repeat-input:hover {
    cursor: pointer;
    border: 1px solid #2563f4;
  }
}
</style>
