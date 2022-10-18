<template>
  <el-dialog
    v-loading="loading"
    title="分配角色"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
    @open="onOpen"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox
        v-for="item in roles"
        :key="item.id"
        :label="item.id"
      >{{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="sureRole">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList, assignRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
export default {
  name: 'HrsaasAssignRole',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [],
      roles: {},
      loading: false
    }
  },
  created() {

  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    async onOpen() {
      const { rows } = await getRoleList()
      console.log(rows)
      this.roles = rows
      this.getUserDetailById()
    },
    async getUserDetailById() {
      try {
        const { roleIds } = await getUserDetailById(this.currentId)
        this.roleIds = roleIds || []
      } catch (e) {
        console.log(e)
      }
    },
    async sureRole() {
      try {
        this.loading = true
        await assignRoles({ id: this.currentId, roleIds: this.roleIds.id })
        this.handleClose()
        this.$message.success('角色分配成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
