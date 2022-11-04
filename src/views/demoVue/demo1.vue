<!-- 模板语法 -->
<template>
  <div style="display: flex">
    <div style="width: 50%">
      <h1>模板语法</h1>
      <span>Message: {{ msg }}</span>

      <p>使用文本: {{ rawHtml }}</p>
      <p>
        使用 v-html directive:
        <span v-html="rawHtml"></span>
      </p>
      <div v-bind:id="dynamicId">Attribute 绑定</div>
      <div v-bind="otherAttributes">
        Attribute 绑定多个值
        {{ number + 1 }}
      </div>
      <span :title="toTitleDate()">
        {{ formatDate() }}
      </span>
      <br />
      <a :[attributeName]="url">..xxxxx.</a>
      <br />
      <div>
        常见事件修饰符：
        <!-- 单击事件将停止传递 -->
        <a @click.stop="formatDate">@click.stop</a>
        <!-- 提交事件将不再重新加载页面 -->
        <form @submit.prevent="formatDate">@submit.prevent</form>
        <!-- 修饰语可以使用链式书写 -->
        <a @click.stop.prevent="formatDate">@click.stop.prevent</a>
        <!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
        <!-- 例如：事件处理器不来自子元素 -->
        <div @click.self="formatDate">self</div>
      </div>
      <br />
      <input @keyup.alt.enter="AltEnter" />
      <n-input style="width: 200px" @keyup.enter="AltEnter"></n-input>
      <!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
      <button @click.ctrl="AltEnter">B</button>
      <!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
      <button @click.ctrl.exact="AltEnter">A</button>
    </div>
    <div style="width: 50%">
      <h1>JSX</h1>
      <demo2 v-model="count"></demo2>
      <Hero></Hero>
    </div>
  </div>
</template>
<script setup lang="ts">
import moment from "moment";
import demo2 from "./demo2.vue";
import Hero from "./hello";
import { computed, watch, reactive, ref, PropType, h } from "vue";
import { provide, inject } from "vue";
import type { InjectionKey } from "vue";
const count = ref(1);
const foo = inject<string>("foo");
const msg = "123";
const rawHtml = "<div>This should be red.</div>"; //在网站上动态渲染任意 HTML 是非常危险的，因为这非常容易造成 XSS 漏洞
const dynamicId = "attributeId";
const otherAttributes = {
  id: "otherAttributesID",
  title: "otherAttributesID",
};
const number = 1; //  {{ number + 1 }} {{ message.split('').reverse().join('') }}
//这些表达式都会被作为 JavaScript ，以组件为作用域解析执行。每个绑定仅支持单一表达式,也就是一段可以被求值的代码，判断方式在前面加一个 return
//{{ var a = 1 }}  {{ if (ok) { return message } }} 都不支持

/**
 * 可以在绑定的表达式中使用组件暴露的一个方法
 * 绑定在表达式中的方法在组件每次更新时都会被重新调用,因此他应该是一个非作用域函数，不对其他数据产生影响
 * 受限的全局访问: 仅能够访问到有限的全局对象列表 没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 window 上的属性
 */

const toTitleDate = (data?: string) => {
  return "2020-10-31";
};
const formatDate = () => {
  console.log(moment().format("HH:mm"));

  return moment().format("HH:mm");
};
/**指令 :表达式的值变化时响应式地更新 DOM
 * v-if v-bind v-on: 简写@
 */
/**动态参数
 * 动态参数中表达式的值应当是一个字符串，或者是 null。特殊值 null 意为显式移除该绑定。其他非字符串的值会触发警告。
 */
const attributeName = "href";
const url = "home";
/**修饰符 ： 修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定
 * .prevent 修饰符会告知 v-on 指令对触发的事件调用 event.preventDefault()
 * 常见事件修饰符： .stop  .prevent .self .capture .once .passive
 * 使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。
 * 因此使用 @click.prevent.self 会阻止元素及其子元素的所有点击事件的默认行为而
 *         @click.self.prevent 则只会阻止对元素本身的点击事件的默认行为。
 */
/**按键修饰符
 * 常见 .enter .tab .delete .space
 * .exact 修饰符 允许控制触发一个事件所需的确定组合的系统按键修饰符。
 */
const AltEnter = () => {
  console.log("Alt +  回车！！");
};
//************************JSX */
const vnode = h(
  "div", //type
  { id: "firstJsx", style: { color: "red" } },
  [
    /* children */
  ]
);
// 除了类型必填以外，其他的参数都是可选的
h("div");
h("div", { id: "foo" });
h("div", { class: "bar", innerHTML: "hello" });
// 类与样式可以像在模板中一样
// 用数组或对象的形式书写
//h("div", { class: [foo, { bar }], style: { color: "red" } });
h("div", { onClick: () => {} });
// children 可以是一个字符串
h("div", { id: "foo" }, "hello");
// 没有 props 时可以省略不写
h("div", "hello");
h("div", [h("span", "hello")]);
h("div", ["hello", h("span", "hello")]);
console.log(vnode);
/**
 * 声明渲染函数
 * 我们可以使用 render 选项来声明渲染函数
 */
function render() {
  return h("div", { id: "foo" }, "hello");
}
//return () => h("div", { id: "foo" }, "hello");
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
<!-- 在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码
    模板 => ast语法 => render函数 => 虚拟dom 
    也可以JSX手写渲染函数而不采用模板 但是这将不会享受到和模板同等级别的编译时优化 只是会更加灵活渲染dom
-->
