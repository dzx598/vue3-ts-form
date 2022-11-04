<template>
  <div class="page">
    <input ref="inputRef" name="333" id="123" />
    <br />
    <ul>
      <li v-for="item in list" ref="itemRefs">
        {{ item }}
      </li>
    </ul>
    <br />
    123213
    {{ proToObj.name }}---- {{ proToObj.age }} -- {{ msg }}
    <demoComponents :obj="proToObj" :msg="msg">
      <div>Something bad happened.</div>
    </demoComponents>
    <!-- <component :is="tabs.dc" v-bind="post"></component> -->
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect, onMounted, computed, reactive } from "vue";
import Stylebind from "./demo-class-style-bind.vue";
import demoComponents from "./demo-components.vue";
// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const inputRef = ref<null | HTMLElement>(null);
const itemRefs = ref<null | HTMLElement[]>(null);
//组件命名方式
const StylebindRef = ref<InstanceType<typeof Stylebind>>();
const list = [1, 2, 3, 4, 5, 6];
const post = {
  id: 1,
  title: "My Journey with Vue",
};
const msg = "大烧饼";
const proToObj = reactive({ name: "张三", age: 18 });
watchEffect(() => {
  if (inputRef.value) {
    //console.dir(inputRef.value);
  } else {
  }
});
//只可以在组件挂载后才能访问模板引用,如果你想在模板中的表达式上访问 input，在初次渲染时会是 null。这是因为在初次渲染前这个元素还不存在
onMounted(() => {
  //console.dir(inputRef.value);
  //console.log(itemRefs.value);
});
/**v-for 中的模板引用
 * 当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组
 * ref 数组并不保证与源数组相同的顺序。
 */
/**
 * 组件中使用ref
 * 如果一个子组件使用的是选项式 API 或没有使用 <script setup>，被引用的组件实例和该子组件的 this 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权
 * 大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互。
 * 使用了 <script setup> 的组件是默认私有的：一个父组件无法访问到一个使用了 <script setup> 的子组件中的任何东西
 * 除非子组件在其中通过 defineExpose 宏显式暴露：
 */
onMounted(() => {
  console.log(StylebindRef.value?.isActive); //true 当父组件通过模板引用获取到了该组件的实例时 ref 都会自动解包，和一般的实例一样
});
/**
 * 动态组件
 */
const tabs = ref({ dc: demoComponents, Sb: Stylebind });
/**
 * pops
 * Prop 名字格式 rop 的名字很长，应使用 camelCase 形式 greetingMessage  => greeting-message
 * 单向数据流 不应该在子组件中去更改一个 prop
 */
//导致你想要更改一个 prop 的需求通常来源于以下两种场景:
// 1.prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性.在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：
const props = defineProps(["initialCounter"]);

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter);
// 2.需要对传入的 prop 值做进一步的转换。在这种情况中，最好是基于该 prop 值定义一个计算属性
const normalizedSize = computed(() => props.initialCounter.trim().toLowerCase());
/**
 * 更改对象 / 数组类型的 props
 * 当对象或数组作为 props 被传入时，虽然子组件无法更改 props 绑定，但仍然可以更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递
 * 这种更改的主要缺陷是它允许了子组件以某种不明显的方式影响父组件的状态，可能会使数据流在将来变得更难以理解。在最佳实践中，你应该尽可能避免这样的更改，
 * 除非父子组件在设计上本来就需要紧密耦合。在大多数场景下，子组件应该抛出一个事件(emit)来通知父组件做出改变或者直接绑定为 v-model
 */
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
