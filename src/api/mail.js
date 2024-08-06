import request from '@/utils/request'

export function getEmailTemplates() {
  return request({
    url: '/mail/templates',
    method: 'post'
  })
}

export function sendEmail(reward) {
  return request({
    url: '/mail/send',
    method: 'post',
    data: reward
  })
}
