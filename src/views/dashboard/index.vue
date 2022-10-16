<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    {{ obj.name }}
    {{ obj.age }}
    <button @click="addAge">点击添加年龄</button>
    <UploaIdmage @on-success="onSuccess" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      // 数据啊应式
      // 数据变化=>视图更新
      // 不是响应式的情况
      // 对象新增属性不是响应式的
      // 通过数组下标修改数据不是响应式的
      obj: {
        name: '张三'
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    addAge() {
      // 单个数据
      this.$set(this.obj, 'age', 20)
      // 多个数据强制更新
      this.$forceUpdate()
    },
    onSuccess(val) {
      console.log('onSuccess', val)
    }
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
