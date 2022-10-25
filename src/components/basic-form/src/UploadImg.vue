<template>
  <div class="UploadImg">
    <span class="btn">
      <n-button>本地上传</n-button>
      <input class="my-input" type="file" @change="changeHandle" />
    </span>
    <div class="images">
      <n-grid :x-gap="xGap" :y-gap="yGap" :cols="cols">
        <n-gi v-for="(url, index) in value" :key="url">
          <div class="item">
            <n-image :src="url" />
            <!-- <img class="img" :src="url" alt="" srcset="" /> -->
            <div class="del-btn">
              <n-icon size="22" @click="delHandle(index)"><trash /></n-icon>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType } from "vue";
import { Trash } from "@vicons/ionicons5";
// import { uploadGoFast } from "@/service/api/common";

const props = defineProps({
  value: {
    type: Array as PropType<any[]>,
    default: () => null,
  },
  xGap: {
    type: Number,
    default: 6,
  },
  yGap: {
    type: Number,
    default: 6,
  },
  // 遵循 n-grid- 组件中的 cols 参数类型
  cols: {
    type: [Number, String],
    default: 3,
  },
});

const emit = defineEmits(["update:value"]);

const changeHandle = (e: any) => {
  console.log(e.target?.files);
  let fd = new FormData();
  fd.append("files", e.target?.files[0]);
  // uploadGoFast(fd).then(res => {
  //   // console.log(res);
  //   let images = props.value ?? [];
  //   if (res.resultMsg) {
  //     images.push(res.resultMsg);
  //   }
  //   emit("update:value", images);
  // });
};

const delHandle = (index: number) => {
  let images = props.value ?? [];
  images.splice(index, 1);
  emit("update:value", images);
};
</script>

<style lang="less" scoped>
.UploadImg {
  width: 100%;
  display: flex;
  flex-direction: column;
  .btn {
    width: min-content;
    position: relative;
    .my-input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 10;
    }
    input::-webkit-file-upload-button {
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
    // #file-upload-button {
    //   // height: 100%;
    //   height: 34px;
    // }
  }
  .images {
    width: 100%;
    margin-top: 6px;
    .item {
      // background-color: aliceblue;
      border: 1px solid #dedede;
      display: flex;
      flex-direction: column;
      height: 130px;
      :deep(.n-image img) {
        width: 100%;
        height: 100px;
        object-fit: cover;
      }
      // .n-image {
      //   img {
      //     // flex: 1;
      //     width: 100%;
      //     height: 100px;
      //     object-fit: cover;
      //   }
      // }

      .del-btn {
        height: 30px;
        display: flex;
        align-items: center;
        .n-icon {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
