import store from '@/store'
export const imgerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(el, binding, vnode) {
    // binding 指令中的变量的解释  其中有一个属性叫做 value
    // el 表示当前指令作用的dom对象
    // vnode 默认节点
    // el 认为此时就是图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    // console.log(el)
    // console.log(binding)
    // console.log(vnode)
    el.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      el.src = binding.value // 这里不能写死
    }
  }
}

export const isHas = {
  inserted(el, binding) {
    // el 表示当前指令作用的dom对象
    console.log(el)
    // binding 指令中的变量的解释  其中有一个属性叫做 value
    console.log(binding)
    const isHas = store.state.user.userInfo.roles.points.includes(binding.value)
    if (isHas) return
    el.remove()
  },
  // 指令和元素绑定
  bind() {
    // 操作样式的dome有了 也和指令绑定了 但是没有插入
  }
}
