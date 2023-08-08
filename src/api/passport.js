import request from '@/utils/request'

export function findByPassport(name) {
  return request({
    url: '/passport/index',
    method: 'post',
    data: { name }
  })
}

export function editPassport(passport) {
  return request({
    url: '/passport/edit',
    method: 'post',
    data: passport
  })
}

