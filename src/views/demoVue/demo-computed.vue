<template>
  <div class="page">
    <p>Has published books: {{ author.books.length }}</p>
    <button @click="author.books.pop()">-</button>
    <span>{{ author.books.length > 0 ? "Yes" : "No" }}</span>
    <br />
    <span>{{ publishedBooksMessage }}----</span>
    <span>{{ calculateBooksMessage() }}</span>
    {{ now }}
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, PropType } from "vue";
const author = reactive({
  name: "John Doe",
  books: ["Vue 2 - Advanced Guide", "Vue 3 - Basic Guide", "Vue 4 - The Mystery"],
});
//使用计算属性来描述依赖响应式状态的复杂逻辑
/**
 * computed() 方法期望接收一个 getter 函数，返回值为一个计算属性 ref。和其他一般的 ref 类似，
 * 你可以通过 publishedBooksMessage.value 访问计算结果。计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 .value。
 * 计算属性会自动追踪响应式依赖。它会检测到 publishedBooksMessage 依赖于 author.books
 * 所以当 author.books 改变时，任何依赖于 publishedBooksMessage 的绑定都会同时更新。
 */
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? "Yes" : "No";
});
/**
 * computed VS 一般方法
 * 若我们将同样的函数定义为一个方法而不是计算属性，两种方式在结果上确实是完全相同的，然而，不同之处在于计算属性值会基于其响应式依赖被缓存
 * 一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要 author.books 不改变，
 * 无论多少次访问 publishedBooksMessage 都会立即返回先前的计算结果，而不用重复执行 getter 函数。
 */
function calculateBooksMessage() {
  return author.books.length > 0 ? "Yes" : "No";
}
const now = computed(() => Date.now()); //计算属性永远不会更新除了刷新
/**
 * 可写计算属性
 *
 */
const firstName = ref("du");
const lastName = ref("zhixiang");
const fullName = computed({
  //计算属性的 getter 应只做计算而没有任何其他的副作用,不能修改其他地方的数据。不要在 getter 中做异步请求或者更改 DOM！
  //因此 getter 的职责应该仅为计算和返回该值
  get(): string {
    return firstName.value + lastName.value + "真帅";
  },

  set(newVal: string) {
    [firstName.value, lastName.value] = newVal.split(",");
  },
});

console.log(fullName.value); //duzhixiang真帅
fullName.value = "张,三";
console.log(fullName.value, firstName.value, lastName.value); //张三真帅 张 三
/**
 * 避免直接修改计算属性值
 * 计算属性返回的值是派生状态，以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照
 * 更改快照是没有意义的，因此计算属性的返回值应该被视为只读的。并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。
 */
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
