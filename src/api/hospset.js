import request from '@/utils/request'

const api_name = '/admin/hosp/hospitalSet'

export default {
  //医院设置列表
  getHospSetList(current, limit, searchObj) {
    return request({
      url: `${api_name}/findPageHospSet/${current}/${limit}`,
      method: 'post',
      data: searchObj //使用json
    })
  },
  //   删除医院设置
  deleteHospSet(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  //   批量删除
  batchRemoveHospSet(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList //  通过请求体传递id列表，对列表中的值进行批量删除
    })
  },
  //   锁定与取消锁定
  lockHospSet(id, status) {
    return request({
      url: `${api_name}/lockHosptialSet/${id}/${status}`,
      method: 'put'
    })
  },
  //   添加医院设置
  saveHospSet(hospitalSet) {
    return request({
      url: `${api_name}/saveHospitalSet`,
      method: 'post',
      data: hospitalSet //   将获取到的医院设置对象通过JSON格式进行传输
    })
  },
  //   根据id获取医院设置
  getHospSet(id) {
    return request({
      url: `${api_name}/getHospSet/${id}`,
      method: 'get'
    })
  },
  //   修改医院设置
  updateHospSet(hospitalSet) {
    return request({
      url: `${api_name}/updateHospSet`,
      method: 'post',
      data: hospitalSet
    })
  }
}