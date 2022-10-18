<template>
  <el-dialog
    title="分配权限"
    :visible="dialogVisible"
    :before-close="handleClose"
    @open="getPermissionList"
  >
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      show-checkbox
      default-expand-all
      :default-checked-keys="selectCheck"
      node-key="id"
      :check-strictly="true"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  name: 'HrsaasManagerPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      permData: [],
      defaultProps: {
        label: 'name'
      },
      selectCheck: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    // 获取整个树结构，填充到permData(转树结构)
    // 根据当前点击的数据id，获取当前角色的权限选中所对应的复选框
    async getPermissionList() {
      try {
        const res = await getPermissionList()
        this.permData = tranListToTreeData(res, '0')
        console.log(this.roleId)
        const { permIds } = await getRoleDetail(this.roleId)
        console.log(permIds)
        this.selectCheck = permIds
        console.log('this.selectCheck', this.selectCheck)
      } catch (e) {
        console.log(e)
      }
    },
    async btnOk() {
      try {
        this.loading = true
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
        this.$message.success('角色分配成功')
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

