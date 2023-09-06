import request from '@/utils/request'

export function getRideConfig() {
  return request({
    url: '/tools/ride-rule/config',
    method: 'post',
    data: {}
  })
}

export function testRideRule(rule, param) {
  return request({
    url: '/tools/ride-rule/test',
    method: 'post',
    data: { rule, param }
  })
}

export function domainCheck() {
  return request({
    url: '/tools/domain/check',
    method: 'post'
  })
}

