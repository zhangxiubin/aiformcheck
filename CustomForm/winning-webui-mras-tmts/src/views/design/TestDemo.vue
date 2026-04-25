<template>
  <div v-win-loading="loading" class=" pos-r">
    TestDemo
  </div>
</template>

<script>
export default {
  name: 'TestDemo',

  inject: ['parseCustomCompConfig'],

  data () {
    return {
      loading: false
    }
  }
}
</script>
