<template>
  <div v-loading="loading" class="departments-container">
    <el-card>
      <treeTools :tree-node="company" :is-root="false" @addDept="handleAddDept" />
    </el-card>
    <el-tree :data="departs" default-expand-all>
      <treeTools slot-scope="{data}" :tree-node="data" @addDept="handleAddDept" @editDept="editDept" @refreshList="getDepartments" />
    </el-tree>
    <!-- 放置新增弹层组件  -->
    <add-dept ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
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
      loading: false,
      departs: [],
      company: {},
      dialogVisible: false, // 显示窗体
      currentNode: {} // 当前操作的节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      try {
        this.loading = true
        const { depts, companyName, companyManage } = await getDepartments()
        this.departs = tranListToTreeData(depts, '')
        this.company = { name: companyName, manager: companyManage, id: '' }
      } finally {
        this.loading = false
      }
    },
    handleAddDept(node) {
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      console.log(node)
      this.currentNode = { ...node }
      // 回显数据
      // node 复制 给 addDept formData
      this.$refs.addDept.formData = { ...node }
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
