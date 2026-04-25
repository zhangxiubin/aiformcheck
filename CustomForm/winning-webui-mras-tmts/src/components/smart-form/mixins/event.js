export default {
  inject: ['$formBus'],
  created () {
    this.$formBus.$on('change-field', this.$_onChangeField)
  },
  beforeDestroy () {
    this.$formBus.$off('change-field', this.$_onChangeField)
  },
  methods: {
    $_onChangeField (val) {
      console.log(val)
    }
  }
}
