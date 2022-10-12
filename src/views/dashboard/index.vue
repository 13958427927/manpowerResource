<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // handleSuccess(data) {
    //   console.log('data', data)
    //   // z做具体业务逻辑
    // },
    // beforeUpload(file) {
    //   console.log(file)
    //   if (file.size > 1024) {
    //     this.$message.error('to big')
    //     return false
    //   }
    //   return true
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
