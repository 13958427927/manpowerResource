// 该文件负责所有的公共的组件的全局注册   Vue.use
// Vue.use 这个方法 注册全局组件
// import PageTools from './PageTools/index.vue'
// 注册自定义指令
// import * as 变量 得到的是一个对象**{ 变量1：对象1，变量2： 对象2 ... }**, 所以可以采用对象遍历的方法进行处理
import * as directives from '@/directives'
import * as filters from '@/filters'
// console.log(filters.formatDate)
// 实现组件的自动注册
// require.context()
const fn = require.context('./', true, /\.vue$/)
// console.log(fn.keys()) // 路径
// console.log(fn('./PageTools/index.vue')) // 根据路径查找模块

const components = fn.keys().map(ele => {
  return fn(ele)
})
// console.log(components)
export default (Vue) => {
  components.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })

  // 遍历所有的导出的指令对象 完成自定义全局注册
  Object.keys(directives).forEach(key => {
    // 注册自定义指令
    Vue.directive(key, directives[key])
  })
  Object.keys(filters).forEach(key => {
    // 全局过滤器filter(), filters()是局部过滤器
    Vue.filter(key, filters[key])
  })
}

