<template>
  <div class="page">
    <n-button @click="mutateDeeply">{{ obj.nested.count }}</n-button>
    <pre>{{ obj.arr }}</pre>
    <n-button @click="shallowDataChange">+</n-button>

    <span key="1">{{ stateShalloe.nested.bar }}</span>
    <span key="2">{{ stateShalloe.foo }}</span>
    <br />
    {{ stateShalloe2.foo }}
    {{ stateShalloe2.nested.bar }}
    <br />
    <n-button @click="stateShallowRefChange">+</n-button>
    {{ stateShallowRef.count }}
    <br />
    <input v-model="textCustom" />
    {{ mapReactive.get("name") }}
    {{ stringReactive }}
    <br />
    {{ message.name }}
    <br />
    {{ count2.obj3.a }}
    <br />
    <p title="hellotitle">hello world</p>
  </div>
</template>
<script setup lang="ts">
import { track } from "@vue/reactivity";
import {
  reactive,
  defineComponent,
  defineAsyncComponent,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  triggerRef,
  customRef,
  toRaw,
  ref,
} from "vue";
import demo2 from "./demo2.vue";
/**
 * 深层次的响应式
 * ref reactive
 */
const obj = reactive({
  nested: { count: 0 },
  arr: ["foo", "bar"],
});

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.nested.count++;
  obj.arr.push("baz");
}
/**nextTick()
 * DOM 更新时机 更改响应式状态后，DOM 会自动更新。然而，你得注意 DOM 的更新并不是同步的。
 * 相反，Vue 将缓冲它们直到更新周期的 “下个时机” 以确保无论你进行了多少次状态更改，每个组件都只需要更新一次。
 */

/**
 * 全局api介绍
 * version：vue版本;
 * defineComponent：在定义 Vue 组件时提供类型推导的辅助函数。
 * defineAsyncComponent: 定义一个异步组件，它在运行时是懒加载的
 */
//  function defineComponent(
//   component: ComponentOptions | ComponentOptions['setup']
// ): ComponentConstructor
//因为 defineComponent() 是一个函数调用，所以它可能被某些构建工具认为会产生副作用，如 webpack。即使一个组件从未被使用，也有可能不被 tree-shake。
//为了告诉 webpack 这个函数调用可以被安全地 tree-shake，我们可以在函数调用之前添加一个 /*#__PURE__*/ 形式的注释：
//export default /*#__PURE__*/ defineComponent(/* ... */)
//如果你的项目中使用的是 Vite，就不需要这么做，因为 Rollup (Vite 背后在生产环境使用的打包器) 可以智能地确定 defineComponent() 实际上并没有副作用，所以无需手动注释。
const Foo = defineComponent({
  demo2,
});
type FooInstance = InstanceType<typeof Foo>;
/**浅层响应式 : 浅层数据结构应该只用于组件中的根级状态 避免将其嵌套在深层次的响应式对象中
 * shallowReactive: 没有深层级的转换:只有根级别的属性是响应式的。属性的值会被原样存储和暴露
 * shallowReadonly：和 readonly() 不同，这里没有深层级的转换：只有根层级的属性变为了只读
 * shallowRef 和 shallowReactive 功能类似
 * triggerRef：强制触发依赖于一个浅层 ref 的副作用 类似于effect $set
 * customRef: 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。
 * toRaw: 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象
 * markRaw:将一个对象标记为不可被转为代理。返回该对象本身。 const foo = markRaw({}) console.log(isReactive(reactive(foo))) // false
 */
const stateShalloe = shallowReactive({
  foo: 1,
  nested: {
    bar: 2,
  },
});
function shallowDataChange() {
  stateShalloe2.nested.bar++; // 不是响应式的
  //stateShalloe2.foo++; //加上之后就都是响应式的
}
const stateShalloe2 = shallowReadonly({
  foo: 1, //只读
  nested: {
    bar: 2,
  },
});
const stateShallowRef = shallowRef({ count: 1 });

function stateShallowRefChange() {
  stateShallowRef.value.count++; //不会触发更改
  // stateShallowRef.value = { count: 1 }; // 触发更改
  //   setTimeout(() => {
  //     triggerRef(stateShallowRef);
  //   }, 1000);
  console.log(textCustom);
  textCustom.value = textCustom.value + "1";
}
/**
 * customRef
 * useDebouncedRef 实现一个防抖数据响应
 * @param value 响应参数
 * @param delay
 * 预期接收一个工厂函数作为参数，这个工厂函数接受 track 和 trigger 两个函数作为参数，并返回一个带有 get 和 set 方法的对象
 * 一般来说，track() 应该在 get() 方法中调用，而 trigger() 应该在 set() 中调用。然而事实上，你对何时调用、是否应该调用他们有完全的控制权。
 */
const textCustom = useDebouncedRef("hello");
function useDebouncedRef(value: any, delay = 500) {
  let timeout: any = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track(); //依赖注入
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger(); //通知更新
        }, delay);
      },
    };
  });
}
/**
 * toRaw
 */
const foo = {};
const reactiveFoo = reactive(foo);
//console.log(toRaw(reactiveFoo) === foo); // true
/**
 * 响应式代理 vs. 原始对象
 */
interface proxy1 {
  nested?: Object;
}
const raw = {}; //只有代理对象是响应式的，更改原始对象不会触发更新
const proxy: proxy1 = reactive(raw);
// 代理对象和原始对象不是全等的
//console.log(proxy == raw); // false
//这个规则对嵌套对象也适用。依靠深层响应性
proxy.nested = raw;
//console.log(proxy.nested === raw); //false
/**reactive() 的局限性
 * 1.仅对对象类型有效（对象、数组和 Map、Set 这样的集合类型），而对 string、number 和 boolean 这样的 原始类型 无效。
 * 2.Vue 的响应式系统是通过属性访问进行追踪的,因此我们必须始终保持对该响应式对象的相同引用/这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失：
 */
const set = new Set();
const setReactive = reactive(set);
const map = new Map([
  ["name", "小米"],
  ["age", "23"],
]);
const reactiveObj = reactive({
  message: { age: 1, name: "xiaoming" },
  other: {
    something: "13",
  },
  phone: 123,
});
const mapReactive = reactive(map);
const mapReactiveCopy = mapReactive;
const string = "123";
const stringReactive = reactive(string);
let { message } = reactiveObj; // reactive结构依然是Proxy
//console.log(message);
setTimeout(() => {
  mapReactive.set("name", "华为");
  message = reactive({ name: "huawei", age: 2 }); // 直接修改会失去响应式
  //   message.name = "huawei";
  // stringReactive = "456"; //无响应
}, 1000);
//console.log(setReactive, "setReactive*mapReactive", mapReactive, stringReactive);
//解构变量
/**
 * ref 定义
 * reactive() 的种种限制归根结底是因为JavaScript 没有可以作用于所有值类型的 “引用”。ref可以对任何值进行响应式
 * ref 的 .value 属性也是响应式的。同时，当值为对象类型时，会用 reactive() 自动转换它的 .value
 * ref在模板渲染上下文的顶层属性时才适用自动“解包”
 */
const count1 = ref(0);
const count2 = ref({ obj3: { a: 1 } });
let { obj3 } = count2.value;

setTimeout(() => {
  obj3.a = 2; //依然具有响应式
  count2.value = { obj3: { a: 4 } };
}, 1000);
//当一个 ref 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样：
const state3 = reactive({
  count1,
});
// state3.count1 = 3;
//console.log(state3.count1); // 1
//如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref：
const otherRef = ref(2);
state3.count1 = otherRef as any;
// 原始 ref 现在已经和 state3.count1 失去联系
//console.log(state3.count1, count1.value); 2  0
//当ref 作为响应式数组或者Map对象被嵌套的时候不会被解包 需要加.value
const books = reactive([ref("Vue 3 Guide")]);
const booksMap = reactive(new Map([["count", ref(0)]]));
//console.log(books[0].value, booksMap.get("count")?.value); //Vue 3 Guide   0
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  p:hover {
    color: rgba(0, 255, 255, 1);
    position: relative;
    cursor: pointer;
  }
  p[title]:hover:after {
    content: attr(title);
    color: #fff;
    padding: 4px 8px;
    position: absolute;
    left: 0;
    top: -160%;
    z-index: 20;
    white-space: nowrap;
    background-color: rgba(37, 39, 42, 0.85);
  }
}
</style>
