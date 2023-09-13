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

export function rtpTemplates() {
  return request({
    url: '/tools/rtp/templates',
    method: 'post'
  })
}

export function rtpSimulator(form) {
  return request({
    url: '/tools/rtp/simulator',
    method: 'post',
    data: form
  })
}

export function rtpReports(formData) {
  return request({
    url: '/tools/rtp/reports',
    method: 'post',
    data: formData
  })
}
