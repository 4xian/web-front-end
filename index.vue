<!--  -->
<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      showRouter: true
    }
  },

  components: {},

  computed: {},

  watch: {},

  mounted() {},

  beforeRouteEnter(to, from, next) {
    next((vm) => vm.router.replace(from.path))
  },

  methods: {
    reload() {
      this.showRouter = false
      this.$nextTick(() => {
        this.showRouter = true
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
