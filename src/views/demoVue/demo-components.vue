<!-- vue组件基础 -->
<template>
  <div>
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
/**
 * 定义组件
 * 1：SFC 单文件组件方式
 * 为什么要使用 SFC？
 * 使用熟悉的 HTML、CSS 和 JavaScript 语法编写模块化的组件。预编译模板，避免运行时的编译开销。
 * 组件作用域的 CSS、在使用组合式 API 时语法更简单、通过交叉分析模板和逻辑代码能进行更多编译时优化、更好的 IDE 支持，提供自动补全和对模板中表达式的类型检查
 * SFC 是 Vue 框架提供的一个功能
 * 单页面应用 (SPA) 、静态站点生成 (SSG)、任何值得引入构建步骤以获得更好的开发体验 (DX) 的项目
 * SFC 是如何工作的?
 * 1个编译后的 SFC 是一个标准的 JavaScript(ES) 模块,你可以像导入其他 ES 模块一样导入 SFC import MyComponent from './MyComponent.vue'
 * SFC 中的 <style> 标签一般会在开发时注入成原生的 <style> 标签以支持热更新，而生产环境下它们会被抽取、合并成单独的 CSS 文件
 * 在实际项目中，我们一般会使用集成了 SFC 编译器的构建工具，比如 Vite 或者 Vue CLI (基于 webpack)
 */
/**
 * 使用组件
 * 传递 props
 */
//defineProps 是一个仅 <script setup> 中可用的编译宏命令
//defineProps(["title"]);
/**
 * 为组件 props 标注类型
 */
//defineProps() 宏函数支持从它的参数中推导类型： 运行时声明
// const props = defineProps({
//   foo: { type: String, required: true },
//   bar: Number,
// });
//我们也可以将 props 的类型移入一个单独的接口中： “基于类型的声明”
interface Props {
  foo: string;
  bar?: number;
}
//const props2 = defineProps<Props>();
//接口或对象字面类型可以包含从其他文件导入的类型引用，但是，传递给 defineProps 的泛型参数本身不能是一个导入的类型：
//import { Props } from './other-file'

// 不支持！
//defineProps<Props>();
//Props 解构默认值
//当使用基于类型的声明时，我们失去了为 props 声明默认值的能力。这可以通过 withDefaults 编译器宏解决：
interface Props2 {
  msg?: string;
  labels?: string[];
  obj?: any;
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
}

// const props3 = withDefaults(defineProps<Props2>(), {
//   msg: "hello",
//   labels: () => ["one", "two"],
//   obj: () => {
//     return {};
//   },
// });
const props3 = defineExpose({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  propC: {
    type: Number,
    default: 80,
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default() {
      return {
        msg: "123",
      };
    },
  },
  // 自定义类型校验函数
  propF: {
    validator(value: any) {
      return ["success", "warning", "danger"].includes(value);
    },
  },
  propG: {
    type: Function,
    default() {
      return () => {};
    },
  },
});
const proToObj2 = reactive({ name: "张三", age: 26 });

console.log(props3);
setTimeout(() => {
  //   props3.msg = "22222222";
  //   props3.obj = proToObj2; //直接修改失效
  //   props3.obj.age = 26; //引用类型
  //   console.log(props3.msg);
}, 1000);
//获取使用es6语法 这个行为目前需要显式地选择开启。
// const { msg = "hello", labels = ["1"] } = defineProps<Props2>();
// console.log(msg, labels);
/**
 * 为组件的 emits 标注类型
 */
// 运行时
const emit = defineEmits(["change", "update"]);
emit("change", 123231);
// 基于类型
// const emits = defineEmits<{
//   (e: "change", id: number): void;
//   (e: "update", value: string): void;
// }>();
//emits("change", 123123);
/**
 * 通过插槽来分配内容                                       <AlertBox>
 * 一些情况下我们会希望能和 HTML 元素一样向组件中传递内容:     Something bad happened.
 *                                                        </AlertBox>
 */
/**
 * Prop 校验
 */
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
