<template>
  <div class="departments-container">
    <el-card>
      <treeTools :tree-node="company" :is-root="false" />
    </el-card>
    <el-tree :data="departs" default-expand-all>
      <treeTools slot-scope="{data}" :tree-node="data" @addDept="handleAddDept" />
    </el-tree>
    <!-- 放置新增弹层组件  -->
    <add-dept :dialog-visible.sync="dialogVisible" />
  </div>
</template>
:props="defaultProps"
<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import addDept from './components/add-dept.vue'
export default {
  name: 'HrsaasIndex',
  components: { treeTools, addDept },
  data() {
    return {
      departs: [],
      company: {},
      dialogVisible: false // 显示窗体
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { depts, companyName, companyManage } = await getDepartments()
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage }
    },
    handleAddDept() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
  .departments-container {
    width: 85%;
    margin: 20px auto;
    .el-tree {
      .el-tree-node__content {
        padding-right: 20px;
      }
    }
  }
  </style>
