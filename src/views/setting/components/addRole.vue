<template>
  <el-dialog
    :title="title"
    width="50%"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
    >
      <el-form-item

        prop="name"
        label="角色"
        :rules="
          [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        "
      >
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  name: 'HrsaasRoleDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      roleForm: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false) // 父子件的这个属性为false 关闭对话框
      // 表单效果重置
      this.$refs.roleDialogForm.resetFields() // 取消后清除表单的值
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async submit() {
      try {
        await this.$refs.roleDialogForm.validate() // 通过表单验证
        this.loading = true
        this.roleForm.id ? await updateRole(this.roleForm) : addRole(this.roleForm) // 接口
        this.$message.success(this.roleForm.id ? '编辑成功' : '新增成功')
        this.$emit('refreshList') // 调用父组件的这个事件
        this.handleClose()
        // 优化点
        // 1. 当打开新增的时候 id 时候 混乱 (数据清除)
        // 2. dialog 标题显示
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
