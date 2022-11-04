<template>
  <div class="page">
    <h2>Class 与 Style 绑定</h2>
    <div class="static" :class="{ active: isActive }">isActive</div>
    <div :class="classObject">classObject</div>
    <br />
    <div :class="[activeClass, errorClass]">array Class</div>
    <div :class="[isActive ? activeClass : '', errorClass]">三元</div>
    <br />
    <div :style="{ color: activeColor, fontSize: fontSize + 'px' }">style</div>
    <div :style="styleObject">styleObject</div>
    <br />
    <div :style="[styleObject, overridingStyles]">Arry</div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
/**
 * 因为 class 和 style 都是 attribute,可以和其他 attribute 一样使用 v-bind 将它们和动态的字符串绑定
 * 但是，在处理比较复杂的绑定时，通过拼接生成字符串是麻烦且易出错的。因此，Vue 专门为 class 和 style 的 v-bind 用法提供了特殊的功能增强。除了字符串外，表达式的值也可以是对象或数组。
 */
/**
 * 绑定对象
 */
const isActive = ref(true);
const classObject = reactive({
  active: true,
  "text-danger": true,
});
/**
 * 绑定数组
 * 可以给 :class 绑定一个数组来渲染多个 CSS class
 */
const activeClass = ref("active");
const errorClass = ref("text-danger");
/**
 * 在组件上使用
 * 对于只有一个根元素的组件，当你使用了 class attribute 时，这些 class 会被添加到根元素上，并与该元素上已有的 class 合并。
 * <!-- 子组件模板 -->
  <p class="foo bar">Hi!</p>
   <!-- 在使用组件时 -->
  <MyComponent class="baz boo" />
  渲染出的 HTML 为：  <p class="foo bar baz boo">Hi</p>
 * 如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 $attrs 属性来实现指定： 
 *  <MyComponent class="baz" />  <p :class="$attrs.class">Hi!</p>    ==>  <p class="baz">Hi!</p>
 */
/**
 * 绑定内联样式
 */
const activeColor = ref("red");
const fontSize = ref(30);
const styleObject = reactive({
  color: "red",
  fontSize: "13px",
});
const overridingStyles = reactive({
  background: "black",
  width: "100px",
});
defineExpose({
  overridingStyles,
  isActive,
});
//绑定数组
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
