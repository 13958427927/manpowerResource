<template>
  <el-dialog title="新增员工" :visible="dialogVisible" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmploy" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-show="showTree" v-loading="loading" :data="treeData" :default-expand-all="true" :props="{ label: 'name' }" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.correctionTime" style="width: 80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
//  实现弹窗组件的显示和隐藏
//  其实 el-dialog 组件显示 隐藏 visible
//  父到子 props
//  点击关闭按钮 close $emit 去改父组件里的值 (upate:dialogVisible)
//  handleClose 完善 // 1. 表单重置 2.表单绑定的值从新赋值
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'HrsaasAddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTree: false,
      treeData: [],
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空' }],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      hireType: EmployeeEnum.hireType
    }
  },

  mounted() { },

  methods: {
    handleClose() {
      // 表单重置
      this.$refs.addEmploy.resetFields()
      // 重新赋值
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.showTree = false
      this.$emit('update:dialogVisible', false)
    },
    async getDepartments() {
      this.loading = true
      this.showTree = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      // console.log(depts)
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      // console.log(node)
      // 选中树的节点把节点对应的数据给departmentName这个字段
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 点击确定待用接口完成新增功能
    // 1.接口封装复制
    // 2.确定按钮点击事件form校验通过之后调用接口引入接口
    // 3.调用接口成功弹窗关闭父组件里列表刷新
    async btnOk() {
      try {
        await this.$refs.addEmploy.validate()
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        // 调用新增接口
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        // this.$emit
        this.$parent.getEmployeeList()
        this.handleClose()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
