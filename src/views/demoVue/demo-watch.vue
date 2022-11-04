<template>
  <div class="page">
    <p>
      Ask a yes/no question:
      <input v-model="question" />
    </p>
    <p>{{ answer }} {{ x }}</p>
    <button>+x</button>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref, reactive, watchEffect } from "vue";
const question = ref("");
const answer = ref("Questions usually contain a question mark. ;-)");

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf("?") > -1) {
    answer.value = "Thinking...";
    try {
      const res = await fetch("https://yesno.wtf/api");
      answer.value = (await res.json()).answer;
    } catch (error) {
      answer.value = "Error! Could not reach the API. " + error;
    }
  }
});
/**
 * 侦听数据源类型
 * 可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组
 */
const x = ref(0);
const y = ref(0);
//单个ref
watch(
  () => x.value,
  newX => {
    //console.log(`x is ${newX}`);
  }
);
//getter 函数
watch(
  () => x.value + y.value,
  sum => {
    //console.log(`sum of x + y is: ${sum}`);
  }
);
//监听多个数据源
watch([x, () => y.value], ([newX, newY]) => {
  // console.log(`x is ${newX} and y is ${newY}`);
});
setTimeout(() => {
  x.value = 10;
  y.value = 100;
  obj.count++;
  state.someObject.count++;
}, 1000);
/**
 * 深层侦听器
 */
const obj = reactive({ count: 0 });
const state = reactive({ someObject: { count: 0 } });
watch(obj, (newValue, oldValue) => {
  //  console.log(newValue, oldValue);
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
});
//深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    console.log(newValue, oldValue);
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
);
/**
 * watchEffect
 * watch() 是懒执行的:仅当数据源变化时，才会执行回调
 * watchEffect() 会立即执行一遍回调函数，
 * 如果这时函数产生了副作用，Vue 会自动追踪副作用的依赖关系，自动分析出响应源
 * watchEffect 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
 */
const data = ref();
const url = ref("192.168.154.8080:////");
watchEffect(async () => {
  const response = await fetch(url.value);
  data.value = await response.json();
});
/**
 * watch vs. watchEffect
 * watch 和 watchEffect 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：
 * watch 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。
 * watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
 * watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。
 * 这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。
 */
/**
 * 回调的触发时机
 * 默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。
 * 这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。
 * 如果想在侦听器回调中能访问被 Vue 更新之后的DOM，你需要指明 flush: 'post' 选项：
 */
watch(
  url,
  () => {
    //dom操作哟
  },
  {
    flush: "post",
  }
);
watchEffect(
  () => {
    //dom操作哟
  },
  {
    flush: "post",
  }
);
//watchPostEffect  /* 在 Vue 更新后执行 */ import { watchPostEffect } from 'vue'
/**
 * 停止侦听器
 * 在 setup() 或 <script setup> 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止
 * 侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，
 * 那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如下方这个例子：
 */
// 它会自动停止
watchEffect(() => {});

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {});
}, 100);
const unwatch = watchEffect(() => {});

// ...当该侦听器不再需要时
unwatch();
//需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据
// 需要异步请求得到的数据
const data1 = ref(null);

watchEffect(() => {
  if (data1.value) {
    // 数据加载后执行某些操作...
  }
});
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>
