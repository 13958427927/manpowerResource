<template>
  <el-row type="flex" justify="space-around" align="middle" style="height:40px; width: 100%;">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <span style="margin-right:10px;">{{ treeNode.manager }}</span>
        <el-dropdown @command="handleCommand">
          <span>
            操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <!-- 编辑部门和删除部门只会在子节点上显示 -->
            <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>

      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: { // isRoot 来控制 编辑部门 和 删除部门 的 显示 隐藏
      type: Boolean,
      default: true // 默认显示
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {
        // 新增
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 编辑
        console.log('22')
      } else {
        // 删除
        console.log('33')
      }
    }
  }
}
</script>

<style>

</style>
