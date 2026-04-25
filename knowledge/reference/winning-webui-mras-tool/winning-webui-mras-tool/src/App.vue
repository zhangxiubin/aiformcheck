<template>
  <Suspense>
    <router-view></router-view>
  </Suspense>
</template>
<script setup lang="ts">
  // import { computed } from "vue";
  // import { utils } from "spark";
  // import { useCounterStore } from "@/stores/index";
  // const store = useCounterStore();
  // const doubleValue = computed(() => store.doubleCount);
  // const { increment } = store;
  // console.log("utils", utils.base64);
</script>
<style lang="scss" scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
  }
</style>
