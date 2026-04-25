import { defineStore } from "spark";

export const useCounterStore2 = defineStore('home', {
  state: () => ({ count: 0, name: 'Eduardo index' }),
  getters: {
    doubleCount2: (state) => state.count * 2,
  },
  actions: {
    increment2() {
      this.count++
    },
  },
})