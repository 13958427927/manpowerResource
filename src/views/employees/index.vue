<template>
  <div>
    <PageTools type="info" :show-before="true">
      <template #before>
        <span slot="before">共166条记录</span>
      </template>
      <template #after>
        <!-- 点击导入按钮实现跳转到导入页面 -->
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="hanleEmploy">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img
              style="width: 50px;height: 50px;border-radius: 50px;"
              :src="row.staffPhoto"
              alt=""
              @click="genQrCode"
            >
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFn" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch
              :value="row.enableState === 1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="goDetail(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next, sizes, total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,5,10,15]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployee :dialog-visible.sync="dialogVisible" />
    <!-- 二维码 -->
    <el-dialog
      title="头像二维码"
      :visible.sync="dialogVisible1"
    >
      <canvas ref="canvas" class="center" />
    </el-dialog>
  </div>
</template>

<script>
// import PageTools from '@/components/PageTools/index.vue'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EnumHireType from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
// console.log(EnumHireType)
import QrCode from 'qrcode'
export default {
  name: 'HrsaasIndex',
  components: { addEmployee },
  // components: { PageTools },
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10
      },
      list: [], // 接数据的
      total: 0, // 总数
      loading: false,
      hireType: EnumHireType.hireType,
      dialogVisible: false,
      dialogVisible1: false
    }
  },
  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        // console.log(rows, total)
        this.list = rows
        this.total = total
      } finally {
        this.loading = false
      }
    },
    formatterFn(row, column, cellValue) {
      // console.log(row, column, cellValue)
      const res = this.hireType.find(ele => ele.id === cellValue)
      // console.log(res.value)
      return res?.value
    },
    hanleEmploy() {
      this.dialogVisible = true
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendors/Export2Excel')
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // console.log(rows)
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(headers)
      const data = rows.map(item => {
        // return []
        return header.map(key => {
          // 循环表头是手机号
          if (key === '聘用形式') {
            const find = this.hireType.find(hire => hire.id === item[headers[key]])
            return find ? find.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // console.log(data)
      export_json_to_excel({
        header, // 表头 必填
        multiHeader: [['手机号', '核心信息', '', '', '', '其它信息', '']], // 复杂表头
        merges: ['A1:A2', 'B1:E1', 'F1:G1'], // 需要合并的部分
        data, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    goDetail(row) {
      this.$router.push(`/employees/detail/${row.id}`)
    },
    genQrCode(staffPhoto) {
      this.dialogVisible1 = true
      if (!staffPhoto) return this.$message.error('暂无头像')
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.canvas, 'sample text', function(error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }

  }
}

</script>

<style lang="scss" scoped>
 .aaa {
  border-radius: 50px;
  text-align: center;
 }
</style>
