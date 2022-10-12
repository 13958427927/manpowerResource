<template>
  <div>
    <UploadExcel :on-success="handleSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'HrsaasIndex',
  data() {
    return {}
  },
  methods: {
    async handleSuccess({ header, results }) {
      console.log(header, results)
      // header  ['手机号', '姓名', '入职日期', '转正日期', '工号']
      // results  [{ '入职日期': 43678, '姓名': '高大山', '工号': 20089, '手机号': 13041131879, '转正日期': 43678 }]

      // 后端接口要的数据：[{ 'timeOfEntry': 43678, 'username': '高大山', 'workNumber': 20089, 'mobile': 13041131879, 'correctionTime': 43678 }]
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      console.log(arr)
      await importEmployee(arr)
      this.$router.back()
    }
  }
}
</script>

<style>

</style>
