<template>
  <div class="index">

    <div class="reservoir">
      蓄水池
      <div class="reservoir-content">
        <div class="content">
          <n-grid id="reservoir">
            <n-gi v-for="item in reservoir" @click="contentClick(item)" :key="item.label" :span="24">
              <div class="content-p">
                <span :style="item.onFocus?{color:'blue'}:''"> {{item.label}}</span>
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
          <n-button size="small" v-if="false">
            新增自定义区域
          </n-button>
        </n-space>
      </div>

      <div class="layout-content">
        <div class="content">
          <n-grid id="layoutArea">

            <n-gi v-for="item in layoutData" :key="item.label" :span="item.width">
              <div class="content-p" @click="contentClick(item)" v-if="!item.children && !item.visable">
                <span :style="item.onFocus?{color:'blue'}:''"> {{item.label}}</span>
              </div>
              <template v-if="item.children">
                自定义区域
              </template>
            </n-gi>
          </n-grid>
        </div>
      </div>
    </div>
    <div class="configArea">
      配置区
      <div class="config-content">
        <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
          <n-form-item label="名称" path="label">
            <n-input v-model:value="formValue.label" placeholder="输入名称" />
          </n-form-item>
          <n-form-item label="宽度" path="width">

            <n-select v-model:value="formValue.width" :options="widthOptions" />
          </n-form-item>
          <!-- <n-form-item label="电话号码" path="phone">
      <n-input v-model:value="formValue.phone" placeholder="电话号码" />
    </n-form-item> -->

        </n-form>
      </div>
    </div>
  </div>
  <div>

  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, nextTick } from "vue";
import { useCountStore } from "@/store";
import { storeToRefs } from "pinia";
import Sortable from "sortablejs";
import { FormInst } from 'naive-ui'
const countStore = useCountStore();
// 通过计算属性
const countComputed = computed(() => countStore.count);
// 通过 storeToRefs api 结构
const { doubleCount } = storeToRefs(countStore);
const x = 1
interface content {
  label: string,
  fileId: string,
  onFocus?: boolean,
  width?: any,
  type?: string,
  visable?: boolean,
  children?: content[],
}

const reservoir: content[] = reactive([{
  label: '蓄水1',
  fileId: 'name',
  onFocus: false,
  type: 'input',
  width: 24
}, {
  label: '蓄水2',
  fileId: 'name2',
  onFocus: false,
  type: 'select',
  width: 24
}, {
  label: '蓄水3',
  fileId: 'name3',
  onFocus: false,
  type: 'date',
  width: 24
}, {
  label: '蓄水4',
  fileId: 'name',
  onFocus: false,
  type: 'checkbox',
  width: 24
}])
const layoutData = ref<content[]>([{
  label: '性别3',
  fileId: 'name',
  onFocus: false,
  width: 24,

}])
const formRef = ref<FormInst | null>(null)
const formValue = ref<content>({
  label: '',
  width: '',
  fileId: '',
})
const rules = {
  label: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  width: {
    required: true,
    message: '请输入宽度',
    type: 'number',
    trigger: ['input', 'blur']
  }
}
const widthOptions = [{
  label: '整行',
  value: 24,
}, {
  label: '半行',
  value: 12,
}, {
  label: '三分之一',
  value: 8,
}, {
  label: '四分之一',
  value: 6,
}]
const contentClick = (content: content) => {
  console.log(content);
  formValue.value = content
  layoutData.value.forEach(item => {
    if (item.label == content.label) {
      item.onFocus = true
    } else {
      item.onFocus = false
    }
  })
}
onMounted(() => {
  const dom1 = document.getElementsByClassName('n-grid')[0] as any
  const sortable1 = Sortable.create(dom1, {
    ghostClass: "sortable-ghost", //拖拽样式})
    animation: 150,
    group: { name: 'shared', pull: 'clone' },
    onEnd: ({ newIndex, oldIndex, from, to }) => {
      let tableData = reservoir
      if (from.id == to.id) {
        let currRow = tableData.splice((oldIndex as number), 0)[0];
        tableData.splice((newIndex as number), 0, currRow);
      }
    },
    onAdd: ({ newIndex, oldIndex, from, to }) => {
      console.log(newIndex, oldIndex);

    }
  })
  const dom2 = document.getElementsByClassName('n-grid')[1] as any
  const sortable2 = Sortable.create(dom2, {
    ghostClass: "sortable-ghost", //拖拽样式})
    animation: 150,
    group: 'shared',
    onEnd: ({ newIndex, oldIndex, from, to }) => {
      // console.log(newIndex, '<--newIndex', oldIndex, '-<--oldIndex---222-');
      // console.dir(from.id, to.id);
      let tableData = layoutData.value
      if (from.id == to.id) {
        let currRow = tableData.splice((oldIndex as number), 1)[0];
        tableData.splice((newIndex as number), 0, currRow);
      }
    },
    onAdd: ({ newIndex, oldIndex, from, to }) => {
      console.log(newIndex, oldIndex);
      let currRow = reservoir[(oldIndex as number)]
      currRow.visable = true
      console.log(currRow, '-', layoutData.value);
      layoutData.value.splice((newIndex as number), 0, currRow);
    }

  })
})
// watch(() => formValue, newval => {
//   console.log(newval, '----');
// }, {
//   deep: true
// })
</script>
<style scoped lang="less">
.index {
  padding: 40px;
  display: flex;
  justify-content: space-between;
  width: 50%;
  border-right: 1px dashed rgb(230, 230, 230);
  ;

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
        }
      }
    }
  }

  .configArea {
    width: 15%;
    height: 500px;

  }
}
</style>
