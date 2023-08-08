import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/passport/index',
    method: 'get',
    params
  })
}
