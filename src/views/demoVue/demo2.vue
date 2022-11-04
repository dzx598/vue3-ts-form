<script lang="ts">
import { ref, h, withModifiers } from "vue";
import demo1 from "./demo1.vue";
import { NInput } from "naive-ui";
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  setup(props, { slots }) {
    const count = ref(1);
    /**
     * JSX 是 JavaScript 的一个类似 XML 的扩展，有了它，我们可以用以下的方式来书写代码
     *  Vue 的 JSX 编译方式与 React 中 JSX 的编译方式不同
     *  1.可以使用 HTML attributes 比如 class 和 for 作为 props - 不需要使用 className 或 htmlFor。
     *  2.传递子元素给组件 (比如 slots) 的方式不同。
     */

    // 返回渲染函数
    // 事件修饰符 onClickCapture  onKeyupOnce
    // 对于事件和按键修饰符，可以使用 withModifiers 函数：

    /**
     * 组件
     *
     */
    //demo1直接渲染
    function render() {
      return h("div", [h(demo1)]);
    }
    h("div", {
      onClick: withModifiers(() => {}, ["self"]),
    });
    return () => [
      h(
        "div",
        {
          onClick: () => {
            count.value + 1;
          },
          onKeyupOnce: () => {},
        },
        h("span", count.value)
      ),
      h("div", "2222222"),
      h("input", {
        modelVaue: count,
        onClick: () => {
          console.log(count.value);
        },
      }),
      h("input", {
        modelValue: props.modelValue,
        "onUpdate:modelValue": (value: any) => emit("update:modelValue", value),
      }),
    ];
  },
};
</script>
