<template>
  <div>
    <!-- action: 远程服务器接口 -->
    <!-- on-preview： 点击预览的回调函数 -->
    <!-- on-remove： 点击删除的回调函数 -->
    <!-- file-list: 上传的文件列表 -->
    <!-- on-change: 上传数据的变化 -->
    <!-- http-request： 覆盖默认的上传行为，可以自定义上传的实现 -->
    <!-- limit: 上传限制 -->
    <!-- before-upload: 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 -->
    <!--  -->
    <el-upload
      v-loading="loading"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="httpRequest"
      :limit="1"
      :before-upload="beforeUpload"
      class="uploadImg"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 预览 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
// 对应的id和key 有后端提供
const cos = new COS({
  SecretId: 'AKID31nNiohV7VgcLRJxOaaP0OZWEiCSTGo8',
  SecretKey: '82jEVXLEsHRO6aooZ7QWr1zlMmyzmKdg'
})
// console.log('cos', cos)
export default {
  name: 'UploaIdmage',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  created() {
  },
  methods: {
    // 预览
    onPreview(file) {
      console.log('预览')
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    // 上传规则
    beforeUpload(file) {
      // 循环 查找某一个数据是否在数组中
      // 1.some()某一个数据是否在数组中
      // 2.find()查找返回找到的那一项
      // 3,findIndex()查找，找到的那一顶的索引更复杂的查找
      // 4.index(0f('1')查找，返回的索引[{id:1},{id:2}]用于简单类型数组
      // 5.includes查找返回的是布尔简单类型数组
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + types.join(',') + '格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    // 删除
    onRemove(file, fileList) {
      this.fileList = fileList
    //   console.log('删除')
    },
    // 图片赋值给列表
    onChange(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
      //   this.fileList.push(file)
      this.fileList = fileList
    },
    // 覆盖上传
    httpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'zy-rz-1-1314348568', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        console.log(err || data)
        if (err) return this.$message.error('上传失败')
        this.loading = false
        this.$emit('on-success', {
          imgUrl: 'http://' + data.Location
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadImg{
    width: 148px;
    height: 148px;
    overflow: hidden;
}
</style>
