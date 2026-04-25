<template>
  <div>
    <p>This is spark docs.</p>
    <span>双倍计数：{{ doubleValue }}</span>
    <w-button @click="increment">+</w-button>
    <span>双倍计数2：{{ doubleValue2 }}</span>
    <w-button @click="increment2">+2</w-button>
    <div>
      <span>composables：{{ count }} --- double {{ double }}</span>
      <w-button @click="incre">composables：incre</w-button>
    </div>
    <router-link to="/">Home</router-link>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from "vue";
  import { useCounterStore } from "@/stores/index";
  import { useCounterStore2, useCounterCom } from "./asyncImport";
  // import Dialog from './components/Dialog.vue'
  // import Select from "./components/Select.vue";
  const store = useCounterStore();
  const doubleValue = computed(() => store.doubleCount);
  const { increment } = store;
  console.log("useCounterStore2", useCounterStore2);
  
  // 使用 ref 初始化变量
  const store2 = ref(null);
  const count = ref(0);
  const double = ref(0);
  const doubleValue2 = ref(0);
  const increment2 = () => {};
  const incre = () => {};
  
  // 异步加载逻辑移到 onMounted 中
  onMounted(async () => {
    console.log("Index page mounted");
    try {
      //@ts-ignore
      const storeModule = await useCounterStore2();
      //@ts-ignore
      store2.value = storeModule.useCounterStore2();
      console.log(111, store2.value);
      
      //@ts-ignore
      const counterModule = await useCounterCom();
      //@ts-ignore
      const counter = counterModule.useCounter({
        initialValue: 10,
        step: 2,
      });
      count.value = counter.count;
      double.value = counter.double;
      incre = counter.incre;
      
      doubleValue2.value = store2.value.doubleCount2;
      increment2 = store2.value.increment2;
    } catch (error) {
      console.error('Failed to load async modules:', error);
    }
  });
</script>
