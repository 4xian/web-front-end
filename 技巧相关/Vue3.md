```vue
<template>
    <div id="refs" ref="refs" class="text">{{ parentData }} {{ comData }}</div>
    <button @click="add">+</button>
    <slot></slot>
    <slot name="rightSlot"></slot>
</template>

<script lang="ts" setup>
import {
    defineComponent,
    ref,
    isRef,
    isReactive,
    reactive,
    nextTick,
    isReadonly, // 是否只读
    isProxy, // 判断是否proxy代理
    customRef, // 自定义ref
    shallowRef, // 浅响应式
    readonly, // 深只读限制
    shallowReadonly, // 浅只读限制
    toRaw, // 将响应式对象转为普通对象
    markRaw, // 标记对象不转为响应式对象
    computed,
    watch,
    watchEffect, // 只监听使用的值，只能获取到最新值，无法获取旧值
    inject,
    useAttrs,
    useSlots,
} from "vue";
import { ObjType, PropsType } from "./type";
/* 1. setup中定义的变量，方法外部使用全都要导出
      2. setup会和data进行合并，优先取setup中的值
  */

// 1.普通定义
let num = ref<number>(10);
let refs = ref<HTMLElement | null>(null);
const obj = reactive<ObjType>({
    name: "哈哈",
    age: 18,
    data: { title: "测试" },
});
const shallowObj = shallowRef({
    name: "jian",
});
const readonObj = readonly({
    name: "只读",
    title: {
        name: "一个名字",
    },
});

const rawObj = toRaw(obj);

// 2.定义props和emits
const props = defineProps({
    msg: String,
});
const emits = defineEmits(["change", "delete"]);

const add = () => {
    emits("change", "这是子传父的数据");
    color.value = "blue";
};

// 3.computed
const comData = computed(() => {
    return `哈哈，${props.msg}`;
});

// 4.watch watchEffect监听
const cancelWatch = watch([num, obj], ([newVal, newObj], [old, oldObj]) => {
    console.log(newVal, old);
    console.log(newObj, oldObj);
});
const watchE = watchEffect(() => {
    console.log(num.value);
});

// 5.inject注入
const parentData = inject("info");

// 6.自定义ref
const useDebouncedRef = <T>(val: T, delay = 3000) => {
    let timer: NodeJS.Timeout;
    return customRef((track, trigger) => {
        return {
            get() {
                track(); // vue追踪数据
                return val;
            },
            set(newVal: T) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    val = newVal;
                    trigger(); // 触发界面更新
                }, delay);
            },
        };
    });
};

// 7.useAttrs/useSlots
const attrs = useAttrs();
const slots = useSlots();
console.log(attrs);
console.log(slots.rightSlot());

// 8. defineExpose
// setup 相当于是一个闭包，除了内部的 template模板，谁都不能访问内部的数据和方法
//对外暴露数据,外部通过ref可以访问内部数据
defineExpose({
    refs,
    comData,
});

// 9. style中使用变量
const color = ref("red");

/* return {
  num,
  add,
  refs,
  obj,
  comData,
  parentData,
}; */
</script>

<script lang="ts">
export default defineComponent({
    name: "HelloWorld",
    data() {
        return {
            count: 0,
        };
    },
});
</script>
<style scoped>
.text {
    color: v-bind(color);
}
</style>

```

