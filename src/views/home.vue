<template>
  <div class="page">
    <div class="index">
      <div class="reservoir">
        蓄水池
        <div class="reservoir-content">
          <div class="content">
            <n-grid id="reservoir">
              <n-gi v-for="item in reservoir" @click="reservoirClick(item)" :key="item.label" :draggable="true" :span="24">
                <div class="content-p">
                  <span>{{ item.label }}</span>
                </div>
              </n-gi>
            </n-grid>
          </div>
        </div>
      </div>
      <div class="layoutArea">
        <div class="layout-title">
          <span>布局区</span>
          <n-space>
            <n-button size="small" v-if="false">新增自定义区域</n-button>
          </n-space>
        </div>

        <div class="layout-content">
          <div class="content">
            <n-grid id="layoutArea" x-gap="12">
              <n-gi v-for="(item, index) in layoutData" :key="index" :span="item.itemSpan">
                <div class="content-p" @click="contentClick(item, index)">
                  <span :style="item.onFocus ? { color: 'blue' } : ''">{{ item.label }}</span>

                  <!-- <n-tag :type="item.onFocus ?'info':''" closable  >{{ item.label }}</n-tag> -->
                  <span class="content-delete" @click.stop="e => deleteItem(e, item, index)">x</span>
                </div>
              </n-gi>
            </n-grid>
          </div>
        </div>
      </div>
      <div class="configArea">
        配置区
        <div class="config-content">
          <config v-model:curryConfig="formValue" :allForm="layoutData" @form-rule-change="formRuleChange"></config>
        </div>
      </div>
    </div>
    <div class="page-show">
      <pre style="width: 160px">{{ layoutData }}</pre>
      <BasicForm
        :rules="FormShowRules"
        :modelValue="modelValue"
        :isrule="true"
        :formItems="layoutData"
        style="display: flex; flex: 1"
        labelPlacement="top"
      ></BasicForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick } from "vue";

import { storeToRefs } from "pinia";
import Sortable from "sortablejs";
import { FormInst, FormRules } from "naive-ui";
import _ from "lodash";

import { globalStore, useCountStore, useHomeStore } from "@/store";
import config from "./commom/config.vue";
import BasicForm from "@/components/basic-form";
import { IFormItem } from "@/components/basic-form/types";
const countStore = useCountStore();
const store = globalStore();
const home = useHomeStore();
const FormShowRules: any = ref({});
// 通过计算属性
const countComputed = computed(() => countStore.count);
// 通过 storeToRefs api 结构
const { doubleCount } = storeToRefs(countStore);
const x = 1;

const reservoir: any[] = reactive([
  {
    label: "输入框",
    field: "input",
    onFocus: false,
    type: "input",
    title: null,
    require: false,
    disable: false,
    itemSpan: 24,
  },
  {
    label: "选择框",
    field: "select",
    onFocus: false,
    type: "select",
    require: false,
    disable: false,
    title: null,
    itemSpan: 24,
  },
  {
    label: "日期时间",
    field: "dataTime",
    onFocus: false,
    type: "dataTime",
    title: null,
    require: false,
    disable: false,
    itemSpan: 24,
  },
  {
    label: "按钮",
    field: "button",
    onFocus: false,
    type: "button",
    require: false,
    disable: false,
    title: null,
    itemSpan: 24,
  },
  {
    label: "多选框",
    field: "checkbox",
    onFocus: false,
    type: "checkbox",
    require: false,
    disable: false,
    title: null,
    itemSpan: 24,
  },
  {
    label: "单选框",
    field: "radio",
    onFocus: false,
    require: false,
    disable: false,
    type: "radio",
    title: null,
    itemSpan: 24,
  },
]);
const layoutData = ref<IFormItem[]>([
  {
    label: "输入框",
    field: "input",
    onFocus: false,
    type: "input",
    require: false,
    disable: false,
    itemSpan: 6,
    title: "ID:",
  },
  {
    label: "输入框",
    field: "input",
    onFocus: false,
    require: false,
    disable: false,
    type: "input",
    title: "身份",
    itemSpan: 6,
  },
  {
    label: "输入框",
    field: "input",
    require: false,
    disable: false,
    onFocus: true,
    type: "input",
    title: "记住",
    itemSpan: 6,
  },
  {
    label: "输入框",
    field: "input",
    onFocus: false,
    require: false,
    disable: false,
    type: "input",
    title: "姓名：",
    itemSpan: 6,
  },
]);
const formRef = ref<FormInst | null>(null);
const formValue = ref<IFormItem>({
  field: "",
  type: "input",
  label: "",
});
const modelValue = ref({});
onMounted(() => {
  const dom1 = document.getElementsByClassName("n-grid")[0] as any;
  console.log(store.$state);
  const sortable1 = Sortable.create(dom1, {
    ghostClass: "sortable-ghost", //拖拽样式})
    animation: 150,
    group: { name: "shared", pull: "clone" },
    onEnd: ({ newIndex, oldIndex, from, to }) => {
      let tableData = reservoir;
      if (from.id == to.id) {
        let currRow = tableData.splice(oldIndex as number, 0)[0];
        tableData.splice(newIndex as number, 0, currRow);
      }
    },
    onAdd: ({ newIndex, oldIndex, from, to }) => {
      console.log(newIndex, oldIndex);
    },
  });
  const dom2 = document.getElementsByClassName("n-grid")[1] as any;
  const sortable2 = Sortable.create(dom2, {
    ghostClass: "sortable-ghost", //拖拽样式})
    animation: 150,
    group: "shared",
    onEnd: ({ newIndex, oldIndex, from, to }) => {
      console.log(newIndex, "<--newIndex", oldIndex, "-<--oldIndex---222-");
      // console.dir(from.id, to.id);

      let tableData = layoutData.value;
      if (from.id == to.id) {
        let currRow = tableData.splice(oldIndex as number, 1)[0];
        tableData.splice(newIndex as number, 0, currRow);
      }
    },
    onAdd: ({ newIndex, oldIndex, from, to }) => {
      console.log(newIndex, oldIndex);
      let currRow = reservoir[oldIndex as number];
      //currRow.visable = true;
      console.log(currRow, "-", layoutData.value);
      layoutData.value.splice(newIndex as number, 0, currRow);
    },
  });
});
const formRuleChange = (formRules: FormRules) => {
  console.log(formRules, "formRules规则改变");
  if (formRules) FormShowRules.value = formRules;
};
const contentClick = (content: IFormItem, index: number) => {
  console.log(content, "************");
  formValue.value = content;
  layoutData.value.forEach((item, i) => {
    if (index == i) {
      item.onFocus = true;
    } else {
      item.onFocus = false;
    }
  });
};
const deleteItem = (e: any, content: IFormItem, index: number) => {
  layoutData.value.splice(index, 1);
};
const reservoirClick = (content: IFormItem) => {
  const obj = _.cloneDeep(content);
  console.log(content, "content***");

  layoutData.value.push(obj);
};
</script>
<style scoped lang="less">
.page {
  display: flex;
  .index {
    padding: 40px;
    display: flex;
    justify-content: space-between;
    width: 50%;
    border-right: 1px dashed rgb(230, 230, 230);
    .reservoir {
      width: 20%;

      .reservoir-content {
        border: 1px dashed rgb(230, 230, 230);
        border-radius: 5px;

        display: flex;
        justify-content: center;
        align-items: center;

        .content {
          width: 80%;

          .content-p {
            margin: 10px 5px;
            cursor: all-scroll;
            background-color: rgb(244, 245, 245);
            padding: 5px 10px;
            font-size: 14px;
          }
        }
      }
    }

    .layoutArea {
      width: 60%;

      .layout-title {
        display: flex;
        justify-content: space-between;
      }

      .layout-content {
        border: 1px dashed rgb(230, 230, 230);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;

        .content {
          width: 80%;

          .content-p {
            margin: 10px 0;
            cursor: all-scroll;
            background-color: rgb(244, 245, 245);
            padding: 5px 10px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            .content-delete {
              cursor: pointer;
              font-size: 15px;
            }
          }
        }
      }
    }

    .configArea {
      width: 15%;
      height: 500px;
    }
  }
  .page-show {
    display: flex;
    flex: 1;
    padding: 10px;
  }
}
</style>
