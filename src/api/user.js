import request from '@/utils/request'

export function getuserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
