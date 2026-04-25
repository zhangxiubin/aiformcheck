import { ref, computed, type Ref } from 'vue'

export interface UseCounterOptions {
  /**
   * 初始值
   */
  initialValue?: number
  /**
   * 步长
   */
  step?: number
}

export interface UseCounterReturn {
  count: Ref<number>
  double: Ref<number>
  incre: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(
  options: UseCounterOptions = {},
): UseCounterReturn {
  const {
    initialValue = 0,
    step = 1,
  } = options

  const count = ref<number>(initialValue)

  const double = computed(() => count.value * 2)

  function incre() {
    count.value += step
  }

  function decrement() {
    count.value -= step
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    double,
    incre,
    decrement,
    reset,
  }
}
