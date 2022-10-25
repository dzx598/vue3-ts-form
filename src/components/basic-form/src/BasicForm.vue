<template>
  <div class="BasicForm">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <n-form
      ref="formRef"
      class="form-content"
      :label-width="labelWidth"
      :label-placement="labelPlacement"
      require-mark-placement="right-hanging"
      :rules="formRule"
      :disabled="formDisabled"
      :model="modelValue"
    >
      <n-grid :x-gap="xGap" :y-gap="yGap" item-responsive>
        <template v-for="item in formItems" :key="item.title">
          <n-grid-item :span="item.itemSpan">
            <!-- 多层结构 -->
            <template v-if="item.type == 'radio-input'">
              <div class="custom-label">
                <!-- label配置项 -->
                <div class="label-item-top">
                  <span class="item-top-left">{{ item.title }}</span>
                  <n-radio-group
                    :value="modelValue[`${item.field}`]"
                    name="radiogroup"
                    :disabled="item.disable"
                    v-bind="item.otherOptions"
                    @update:value="handleValueChange($event, item.field)"
                  >
                    <n-space>
                      <n-radio v-for="(r, i) in item.radios" :key="i" :value="r.value">
                        {{ r.label }}
                      </n-radio>
                    </n-space>
                  </n-radio-group>
                </div>
                <!-- otherOptions 配置 -->
                <div class="label-item-bottom">
                  <n-input
                    :disabled="item.disable"
                    :placeholder="item.otherOptions?.placeholder ?? '请输入'"
                    :value="modelValue[`${item?.otherOptions?.field}`]"
                    @update:value="handleValueChange($event, item.otherOptions?.field)"
                    v-on="item.events ?? {}"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <n-form-item :label="item.title" :path="item.require ? item.field : undefined">
                <template v-if="item.type === 'input'">
                  <n-input
                    :placeholder="item.placeholder ?? '请输入'"
                    v-bind="item.otherOptions"
                    :disabled="item.disable"
                    :value="modelValue[`${item.field}`]"
                    @update:value="handleValueChange($event, item.field)"
                  />
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <n-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    :disabled="item.disable"
                    :placeholder="item.placeholder ?? '请输入'"
                    v-bind="item.otherOptions"
                    :value="modelValue[`${item.field}`]"
                    @update:value="handleValueChange($event, item.field)"
                  />
                </template>
                <template v-else-if="item.type === 'number'">
                  <n-input-number
                    v-bind="item.otherOptions"
                    :value="modelValue[`${item.field}`]"
                    clearable
                    :disabled="item.disable"
                    :placeholder="item.placeholder ?? '请输入'"
                    @update:value="handleValueChange($event, item.field)"
                    v-on="item.events ?? {}"
                  >
                    <template #suffix>{{ item.otherOptions?.suffix }}</template>
                  </n-input-number>
                  <!-- <n-input
                    :placeholder="item.placeholder"
                    :value="modelValue[`${item.field}`]"
                    @update:value="handleValueChange($event, item.field)"

                     :fallback-option="(value:any) => { return fallbackOption(value,item)}"
                    
                  /> -->
                </template>

                <template v-else-if="item.type === 'select' || item.type === 'select-multiple'">
                  <n-select
                    :ref="item.ref"
                    :disabled="item.disable"
                    :placeholder="item.placeholder ?? '请选择'"
                    v-bind="item.otherOptions"
                    style="width: 100%"
                    :value="modelValue[`${item.field}`]"
                    :options="item.options"
                    @update:value="handleSelectChange($event, item.field, item)"
                    @search="handleSearch($event, item.field, item)"
                  ></n-select>
                </template>
                <template v-else-if="item.type === 'datetime'">
                  <n-date-picker
                    type="datetime"
                    :disabled="item.disable"
                    :placeholder="item.placeholder ?? '请选择'"
                    style="width: 100%"
                    :formatted-value="modelValue[`${item.field}`]"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-bind="item.otherOptions"
                    @update:value="handleDateTimeChange($event, item.field)"
                  ></n-date-picker>
                </template>
                <template v-else-if="item.type === 'date'">
                  <n-date-picker
                    type="date"
                    :disabled="item.disable"
                    :placeholder="item.placeholder ?? '请选择'"
                    style="width: 100%"
                    :formatted-value="useDate(modelValue[`${item.field}`])"
                    v-bind="item.otherOptions"
                    @update:value="handleDateChange($event, item.field)"
                  ></n-date-picker>
                </template>
                <template v-else-if="item.type === 'radio'">
                  <n-popconfirm :positive-text="null" :disabled="!item.otherOptions?.popconfirmShow" :negative-text="null">
                    <template #trigger>
                      <n-radio-group
                        :value="modelValue[`${item.field}`]"
                        name="radiogroup"
                        v-bind="item.otherOptions"
                        :disabled="item.disable"
                        @update:value="handleValueChange($event, item.field)"
                      >
                        <n-space>
                          <n-radio v-for="(r, i) in item.radios" :key="i" :value="r.value">
                            {{ r.label }}
                          </n-radio>
                        </n-space>
                      </n-radio-group>
                    </template>
                    选择不收费就不会生成医嘱
                  </n-popconfirm>
                </template>
                <template v-else-if="item.type === 'checkbox'">
                  <n-checkbox-group
                    :value="modelValue[`${item.field}`]"
                    :disabled="item.disable"
                    @update:value="handleValueChange($event, item.field)"
                  >
                    <n-space>
                      <n-checkbox v-for="(r, i) in item.checkboxs" :key="i" :value="r.value">
                        {{ r.label }}
                      </n-checkbox>
                    </n-space>
                  </n-checkbox-group>
                </template>
                <template v-else-if="item.type === 'checkboxTree'">
                  <n-tree-select
                    v-bind="item.otherOptions"
                    ref="treeSelectRef"
                    multiple
                    check-strategy="all"
                    checkable
                    :options="item.options"
                    :render-label="checkboxTreeRenderLabel"
                    filterable
                    clearable
                    :filter="(value:any, option:any) => treeSelectFilter(value, option, item)"
                    :node-props="checkboxTreeNode"
                    :value="modelValue[`${item.field}`]"
                    :clear-filter-after-select="false"
                    @keydown="treeSelectAdd($event, item)"
                    @search="selectTreeSearch($event, item)"
                    @update:value="handleValueChange($event, item.field)"
                  ></n-tree-select>
                </template>
                <template v-else-if="item.type === 'selectTree'">
                  <n-space vertical style="width: 100%">
                    <n-select
                      :value="modelValue[`${item.field}`]"
                      filterable
                      :options="item.selectOptions"
                      multiple
                      tag
                      placeholder="输入，按回车确认"
                      :show-arrow="false"
                      :show="false"
                      @search="selectTreeSearch($event, item)"
                    />
                    <n-tree
                      block-line
                      :data="item.options"
                      :pattern="item.pattern"
                      checkable
                      expand-on-click
                      selectable
                      @update:checked-keys="updateCheckedKeys($event, item.field)"
                    />
                  </n-space>
                </template>
                <template v-else-if="item.type === 'img'">
                  <n-image-group>
                    <n-space>
                      <template v-for="(r, i) in modelValue[`${item.field}`]" :key="i">
                        <div v-if="r.checked" class="img-box">
                          <n-image width="100" :src="r.url" />
                          <div class="img-remark">{{ r.remark }}</div>
                        </div>
                      </template>
                    </n-space>
                  </n-image-group>
                </template>
                <!-- 下拉 可重复多选 -->
                <template v-else-if="item.type == 'select-repeat'">
                  <select-repeat
                    :placeholder="item.placeholder ?? '请选择'"
                    :value="modelValue[`${item.field}`]"
                    :options="item.options"
                    @update:value="handleSelectChange($event, item.field, item)"
                  ></select-repeat>
                </template>
                <!-- 图片上传 -->
                <template v-else-if="item.type == 'uploadImg'">
                  <upload-img
                    :disabled="item.disable"
                    :value="modelValue[`${item.field}`]"
                    v-bind="item.otherOptions"
                    @update:value="handleValueChange($event, item.field)"
                  ></upload-img>
                </template>
              </n-form-item>
            </template>
          </n-grid-item>
        </template>
      </n-grid>
    </n-form>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, nextTick, watch, reactive, toRefs, h, VNodeChild, onMounted, onUnmounted } from "vue";
import { FormInst, FormRules, TreeSelectOption } from "naive-ui";
import moment from "moment";
import { emitter } from "@/utils/event-bus";
import SelectRepeat from "./SelectRepeat.vue";
import UploadImg from "./UploadImg.vue";
import { IFormItem, LabelPlacementType } from "../types";
import { useDate } from "@/hooks/use-form-data";
import { IdCodeValid, getInfoByIdCard, throttle, _debounce } from "@/utils/tool";
import { fi } from "date-fns/locale";
export default defineComponent({
  components: {
    SelectRepeat,
    UploadImg,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    formItems: {
      //===>>> 注：as 类型断言。将Array类型指定成 IFormItem[] 类型。也就是说数组里面的类型要是 IFormItem类型。否则会报错
      type: Array as PropType<IFormItem[]>,
      //注：default是函数的时候 要写成 () => 函数
      default: () => [],
    },
    labelWidth: {
      type: String,
      default: "auto",
    },
    itemStyle: {
      type: Object,
      default: () => ({ padding: "10px 20px 0px 20px" }),
    },
    rules: {
      type: Object as PropType<FormRules>,
      default: () => ({}),
    },
    saveBodyMethod: {
      type: Function,
      default: () => {},
    },
    //===>>>注：响应式布局配置。一行显示多少个
    // colLayout: {
    //   type: Object,
    //   default: () => ({
    //     xl: 6, // 屏幕>1920px 时候 一行先试试 4个 => 24/6 = 4
    //     lg: 8,
    //     md: 12,
    //     sm: 24,
    //     xs: 24,
    //   }),
    // },
    xGap: {
      type: Number,
      default: 12,
    },
    yGap: {
      type: Number,
      default: 0,
    },
    // 遵循 n-grid- 组件中的 cols 参数类型
    cols: {
      type: [Number, String],
      default: 1,
    },
    labelPlacement: {
      type: String as PropType<LabelPlacementType>,
      default: "left",
    },
  },
  emits: ["update:modelValue", "fallbackOption"],
  setup(props, { emit }) {
    //const formRule = ref({ ...props.rules });

    const formRule = ref();
    const formRef = ref<FormInst | null>(null);
    // 默认 当前时间
    const treeSelectRef = ref();
    const defaultTime = new Date().valueOf();
    const stateRef = reactive({}) as any;
    const formDisabled = ref(false);
    const handleValueChange = (value: any, field: string) => {
      // console.log("输入框输入|下拉框输入", value, field, props.modelValue);
      let modelValue = props.modelValue;

      if (field) {
        modelValue[field] = value;
        // emit("update:modelValue", { ...props.modelValue, [field]: value });
        emit("update:modelValue", modelValue);
      }
    };

    const handleDateTimeChange = (value: any, field: string) => {
      let modelValue = props.modelValue;
      let date = null;
      if (value) {
        date = moment(value).format("YYYY-MM-DD HH:mm:ss");
        // console.log("日期选择", value, field, date);
        modelValue[field] = date;
        // emit("update:modelValue", { ...props.modelValue, [field]: date });
        emit("update:modelValue", modelValue);
      } else {
        modelValue[field] = date;
        // emit("update:modelValue", { ...props.modelValue, [field]: date });
        emit("update:modelValue", modelValue);
      }
    };

    const handleDateChange = (value: any, field: string) => {
      let modelValue = props.modelValue;
      let date = null;
      if (value) {
        date = moment(value).format("YYYY-MM-DD HH:mm:ss");
        // console.log("日期选择", value, field);
        modelValue[field] = date;
        // emit("update:modelValue", { ...props.modelValue, [field]: date });
        emit("update:modelValue", modelValue);
      } else {
        modelValue[field] = date;
        // emit("update:modelValue", { ...props.modelValue, [field]: date });
        emit("update:modelValue", modelValue);
      }
    };

    const handleSelectChange = (value: any, field: string, item: IFormItem) => {
      // 是否要匹配保存其他字段,比如: select下拉框选择后 一般保存选择的id.有的需求也需要保存name
      // console.log("======", value);
      let modelValue = props.modelValue;
      let temp = { [field]: value };
      if (item.otherField?.field) {
        const result = item.options?.find(ele => value == ele.value);
        temp[item.otherField?.field] = result?.label;
      }
      Object.assign(modelValue, temp);
      // emit("update:modelValue", { ...props.modelValue, ...temp });
      // ===>>> 为了解决 表单选中了数据 检验不及时的问题(就是明明已经选中了数据 但是还是提示没有选，要失去焦点后才正确检验了)。
      // ===>>> 但是 此方法有违单向数据流原则
      console.log(item, value, "---");
      emit("update:modelValue", modelValue);
      if (item.selectUpdate) {
        item.selectUpdate(value);
      }
    };
    const handleSearch = async (value: any, field: string, item: IFormItem) => {
      if (item.searchMethod) {
        const search = _debounce(async () => {
          if (item.searchMethod) {
            let list = await item.searchMethod(value, undefined, item);
            setTimeout(() => {
              item.options = list;
            }, 300);
          }
        }, 500);
        search();
        //   let lists = ref(list);
      }
    };
    const fallbackOption = async (value: any, item: any) => {
      return { label: "" + value, value };
    };

    const submit = (): Promise<Boolean> => {
      return new Promise((resolve, reject) => {
        formRef.value?.validate(errors => {
          if (!errors) {
            // message.success("验证成功");
            // console.log("成功");
            resolve(true);
          } else {
            // console.log(errors);
            // console.log("验证失败");
            reject(errors);
          }
        });
      });
    };

    //身份证加校验规则
    watch(
      () => props.rules,
      newValue => {
        formRule.value = props.rules;
        if (newValue.certificateNumber) {
          if (formRule.value?.certificateNumber) {
            formRule.value.certificateNumber[0].validator = IdCode;
          }
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    const IdCode = () => {
      if (props.modelValue.certificateNumber && props.modelValue.certificateType == "01") {
        const result = IdCodeValid(props.modelValue.certificateNumber);
        return result.success;
      }
    };
    const checkboxTreeRenderLabel = (option: any): VNodeChild => {
      return [
        h(
          "p",
          {
            style: {
              fontSize: "13px",
            },
          },
          option.option.label
        ),
      ];
    };
    const checkboxTreeNode = (info: { option: TreeSelectOption }) => {
      return { title: info.option.label };
    };
    /**
     * 树形选择
     * @param v
     */
    const updateCheckedKeys = (v: string[], field: string) => {
      let modelValue = props.modelValue;
      modelValue[field] = v;
      emit("update:modelValue", modelValue);
    };
    /**
     * 树形搜索
     * @param value
     */
    const selectTreeSearch = (value: string, item: IFormItem) => {
      console.log(value, item);
      // item.pattern = value;
    };
    /**
     * 树形添加新元素
     * @param val
     * @param item
     */
    const treeSelectAdd = (val: any, item: IFormItem) => {
      let modelValue = props.modelValue;
      if (val.keyCode == 13) {
        try {
          const patterName = item.options?.find(i => i.label == item.pattern);
          if (patterName) {
            modelValue[item.field]?.push(patterName.key);
            treeSelectRef.value[0]?.triggerInstRef.blur();
            return;
          } else {
            props
              .saveBodyMethod(item.pattern)
              .then((res: any) => {
                console.log(res);

                item.options?.push({ label: item.pattern, key: res.obj.codeId });
                if (!modelValue[item.field]) {
                  emit("update:modelValue", [res.obj.codeId]);
                } else {
                  modelValue[item.field]?.push(res.obj.codeId);
                  emit("update:modelValue", modelValue);
                }
              })
              .catch(() => {
                window.$message.error("手动添加错误");
                throw false;
              })
              .finally(() => {
                treeSelectRef.value[0]?.triggerInstRef.blur();
              });
          }
        } catch (error) {
          console.log(error, "--手动添加错误---");

          window.$message.error("手动添加错误");
        }
      }
    };
    const treeSelectFilter = (pattern: string, option: TreeSelectOption, item: IFormItem) => {
      item.pattern = pattern;
      if (option?.label?.includes(pattern)) {
        return true;
      }
    };
    watch(
      () => props.formItems,
      newValue => {
        newValue.forEach(item => {
          if (item.ref) {
            stateRef[item.ref] = "";
          }
        });
      },
      {
        deep: true,
        immediate: true,
      }
    );
    // 设置了默认时间  需要同步父组件中
    nextTick(() => {
      props.formItems.forEach(item => {
        if (item.type == "datetime") {
          emit("update:modelValue", { ...props.modelValue, [item.field]: moment(defaultTime).format("YYYY-MM-DD HH:mm:ss") });
        }
      });
    });
    // 校验单个表单项
    /**
     * key: 配置rules 中校验字段中的 key 字段
     */
    const validatePartial = (key: string) => {
      formRef.value?.validate(
        errors => {
          if (errors) {
            console.log("校验失败");
          }
        },
        rule => {
          return rule?.key === key;
        }
      );
    };
    // onMounted(() => {
    //   console.log("onMounted***BasicForm***");
    //   emitter.on("publish_from_disabled", value => {
    //     if (value) formDisabled.value = value;
    //     console.log(formDisabled.value, "formDisabled.value");
    //   });
    // });
    // onUnmounted(() => {
    //   emitter.off("publish_from_disabled");
    // });
    return {
      formRef,
      formRule,
      treeSelectRef,
      formDisabled,
      ...toRefs(stateRef),
      handleValueChange,
      updateCheckedKeys,
      selectTreeSearch,
      treeSelectAdd,

      treeSelectFilter,
      handleDateTimeChange,
      IdCode,
      checkboxTreeNode,
      checkboxTreeRenderLabel,
      handleSearch,
      fallbackOption,
      submit,
      handleSelectChange,
      handleDateChange,
      validatePartial,
      useDate,
    };
  },
});
</script>

<style scoped lang="less">
.BasicForm {
  padding: 20px 12px 20px 12px;
  // display: flex;
  // flex-direction: column;
  // .form-content {
  //   flex: 1;
  //   overflow-y: auto;
  // }
  .n-form {
    .n-input-number {
      flex: 1;
    }
  }
  .form-content {
    .custom-label {
      padding-bottom: 24px;
      .label-item-top {
        padding: 0 0 5px 2px;
        .item-top-left {
          margin-right: 10px;
        }
      }
    }
    .img-box {
      width: 100px;
      padding: 5px;
      overflow: hidden;
      border: 1px solid #ccc;
      .img-remark {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
