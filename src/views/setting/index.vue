<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <!-- 新增角色按钮 -->
          <el-row style="height:60px" :futter="10">
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="dialogVisible = true"
            >新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table v-loading="loading" border="" :data="roleList">
            <el-table-column align="center" type="index" label="序号" width="120" />
            <el-table-column align="center" prop="name" label="名称" width="240" />
            <el-table-column align="center" prop="description" label="描述" />
            <el-table-column align="center" label="操作">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row type="flex" justify="end" align="middle" style="height: 60px">
            <!-- 分页组件 -->
            <!--  background   添加背景
               current-page 当前的页面
               page-size    每一页展示的条数
               page-sizes   每页显示个数选择器的选项设置
               total        总共多少条数据
               layout       布局
               current-change 改变当前页码的触发（current-page 值改变的时候触发）
               size-change 改变页面的数据条数的时候 触发（page-size 值改变的时候触发） -->
            <el-pagination
              v-if="total>0"
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size="page.pagesize"
              :page-sizes="[2, 5, 10, 15]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司设置" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <addRole ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
  </div>
</template>
companyAddress
<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import addRole from './components/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: { addRole },
  data() {
    return {
      activeName: 'first',
      roleList: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      },
      loading: true,
      total: 0, // 记录总数
      dialogVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
  },
  created() {
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        // total 大于0 并且 rows的length === 0 这种情况并不是正在的没有数据 是有的，要重新发起请求
        if (this.total > 0 && this.roleList.length === 0) {
          this.page.page--
          this.getRoleList()
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    editRole(row) {
      // 拿到点击事件
      // 拿到当前行的这条数据
      // 会先在新增角色的组件上
      // row直接赋值给 addRole 的 roleForm
      // 直接赋值给formData，如果修改了formData的值，表格里面的值也会修改
      // 因为地址是一样 指的是同一个对象
      this.$refs.addRole.roleForm = { ...row } // 把表格里面的数据赋值给组件的的formData
      this.dialogVisible = true
      // 优化 数据是引用类型带来的问题
    },
    // 删除角色
    async delRow(id) {
      // this.$confirm('是否删除该角色？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
      console.log(id)
      try {
        await this.$confirm('是否删除该角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (e) {
        console.error(e.message)
      }
    },
    // 获取公司接口封装号
    async getCompanyInfo() {
    // 拿到companyId
    // 1. this.$store.state.user.userInfo.companyId
    // 2. this.$store.getters.companyId
    // 调用  获取公司接口
      this.companyInfo = await getCompanyInfo(this.companyId)
      console.log(this.companyInfo)
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
