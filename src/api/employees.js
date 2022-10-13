import request from '@/utils/request'

/**
* 获取员工的简单列表
*/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeList(params) {
  // 可以和后端约定
  // 联调：联合调试接口，接口调试能否跑通，有什么报错，返回的数据是否符合
  // 分页接口， 如果不传参数，后端返回所有数据
  return request({
    url: '/sys/user',
    params
  })
}
/** **
 *  新增员工的接口
 * **/
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/**
 * 删除员工接口
 * ****/

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getEmployeesInfo(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}
/**
 * 保存员工基本信息
 * @param {*} data
 * @returns
 */
export function saveEmployeesInfo(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
/** *
 *  读取用户详情的基础信息
 * **/
export function getEmployessJobInfo(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}
/** *
 *  保存用户详情的基础信息
 * **/
export function saveEmployessJobInfo(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
