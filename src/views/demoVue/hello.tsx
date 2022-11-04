import {defineComponent,ref,h} from "vue";
import {NButton} from "naive-ui";
const ok = ref(true)
const Hero = defineComponent({
    setup() {
        const vnode = <div>vnode</div>
        const vnode2 = h('div', [ok.value ? h('div',{onClick:() => {ok.value = false,console.log(ok.value);
        }}, ok.value?'yes':'no') : h('span', 'no')])
        const vnode3 = h(NButton,{onClick:() => {ok.value = !ok.value;console.log(ok.value)}},h('span',ok.value))
        return () => <>
            <div>JSX test</div>
            <vnode></vnode>
            <vnode2></vnode2>
            <vnode3></vnode3>
        </>
    }
})
export default Hero