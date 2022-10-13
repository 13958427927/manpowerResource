<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane lazy label="登录账户设置" name="first">
          <!-- 放置表单 -->
          <el-form ref="form" :model="accountInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="accountInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="新密码:" prop="password">
              <el-input v-model="accountInfo.password" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="updateEmployees">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane lazy label="个人详情" name="second">
          <userInfo />
        </el-tab-pane>
        <el-tab-pane lazy label="岗位信息" name="third">
          <jobInfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user'
import jobInfo from './components/job-info.vue'
import userInfo from './components/user-info.vue'
import Cookies from 'js-cookie'
export default {
  components: {
    jobInfo,
    userInfo
  },
  data() {
    return {
      loading: false,
      // 读取Cookies， Cookies.get('储存在Cookies里的名字')
      activeName: Cookies.get('activeName') || 'first', // tabs 默认选中
      accountInfo: {},
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 1, message: '长度2-9位', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码长度最小6位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 获取个人信息
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      this.accountInfo = res
    },
    // 更新用户信息
    async updateEmployees() {
      // async 和 await 有什么缺点
      //  错误 必须try catch进行捕获
      try {
        await this.$refs.form.validate()
        this.loading = true
        await saveUserDetailById(this.accountInfo)
        this.$message.success('更新成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    tabClick() {
      // console.log(this.activeName)
      // 储存在Cookies里(储存名字，储存参数)
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
