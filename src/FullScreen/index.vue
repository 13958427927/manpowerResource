<template>
  <div>
    <!-- svg-icon标签 是已经封装好的 在components/SvgIcon/index.vue 这个全局组件 -->
    <svg-icon icon-class="fullscreen" class-name="fullScreen" @click="toggleFullScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
console.log(ScreenFull)
export default {
  name: 'FullScreen',
  methods: {
    toggleFullScreen() {
      if (!ScreenFull.isEnabled) return this.$message.error('帅哥来喽')
      ScreenFull.toggle()
    }
  }
}
</script>

<style scoped>

.fullScreen {
    /* 引入svg的图标是黑的给他变成白的 */
    /* 类名就是class-name="fullScreen" 来的 */
    color: #fff;
}
</style>
