<template>
  <div>
    <div class="dashboard-container">
      <div class="app-container">
        <!-- 靠右的按钮 -->
        <PageTools :show-before="false">
          <template #after>
            <el-button type="primary" size="small" @click="addPermission('0', 1)">添加权限</el-button>
          </template>
        </PageTools>
        <!-- 表格 -->
        <el-table ref="table" v-loading="loading" :data="list" border="" row-key="id">
          <el-table-column label="名称" prop="name">
            <template slot-scope="{row}">
              <div @click="expandColumn(row)">
                <template v-if="row.type===1">
                  <i :class="row.children? 'el-icon-folder-opened' :'el-icon-folder'" />
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </template>
                <template v-else>
                  <i class="el-icon-folder" style="margin-left:20px;" />
                  <span style="margin-left: 10px">{{ row.name }}</span>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.type === 1"
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="addPermission(row.id, 2)"
              >添加</el-button>
              <el-button type="text" icon="el-icon-edit" @click="addPermission1(row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="formData.id ? '修改权限' : '新增权限' "
      :visible="dialogVisible"
      :before-close="handleClose"
      @close="onClose"
    >
      <el-form ref="perForm" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="saveAddpermission">确定</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'HrsaasIndex',
  data() {
    return {
      list: [],
      loading: false,
      dialogVisible: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '权限名称必填' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '权限标识必填' }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },

  methods: {
    async getPermissionList() {
      try {
        this.loading = true
        const res = await getPermissionList()
        this.list = tranListToTreeData(res, '0')
        // console.log(this.list)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 树状图展开关闭
    expandColumn(row) {
      // console.log(row)
      // 传递一行数据
      // 展开的状态
      // toggleRowExpansion(row, expanded)
      row.isExpand = !row.isExpand
      this.$refs.table.toggleRowExpansion(row, row.isExpand)
    },
    // 弹窗关闭
    handleClose() {
      this.dialogVisible = false
    },
    // 新增弹窗
    addPermission(id, type) {
      this.dialogVisible = true
      this.formData.pid = id
      this.formData.type = type

      console.log(this.formData)
    },
    addPermission1(row) {
      this.dialogVisible = true
      this.formData.id = row.id
      this.formData.name = row.name
      this.formData.code = row.code
      this.formData.description = row.description
      this.formData.enVisible = row.enVisible
    },
    // 确定弹窗
    async saveAddpermission() {
      try {
        this.loading = true
        this.$refs.perForm.validate()
        this.formData.id ? await updatePermission(this.formData) : await addPermission(this.formData)
        this.$message.success(`${this.formData.id ? '修改' : '新增'}成功`)
        this.getPermissionList()
        this.dialogVisible = false
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    // 监听关闭前的回调
    onClose() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
    },
    // 删除
    async del(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__expand-icon{
  display: none !important;
}
</style>
