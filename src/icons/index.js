import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// webpack 依赖管理，可以通过require.context 实现批量导入文件
const req = require.context('./svg', false, /\.svg$/) // 找匹配的文件
// require.context 方法 可以实现批量导入文件
// require.context(directory, useSubdirectories, regExp)
// directory: 要查找的文件路径
// useSubdirectories: 是否查找子目录
// regExp: 要匹配文件的正则
// 返回一个方法

// 返回的方法具有一个 keys 属性
// keys 函数 返回一个数组
// 数组里就是匹配到的所有文件

// 不想一个个的引入import
// 导入模块
const requireAll = requireContext => requireContext.keys().map(requireContext) // 引入匹配的文件
// map 返回一个数组
// 长度和原来的一样
// 映射

requireAll(req)
// console.log(requireAll(req))
