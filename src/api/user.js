import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function userList() {
  return request({
    url: '/user/list',
    method: 'post'
  })
}

export function userUpsert(userForm) {
  return request({
    url: '/user/upsert',
    method: 'post',
    data: userForm
  })
}

export function userDelete(name) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: { name }
  })
}

