import request from '@/utils/request'

export function getMainTypes() {
  return request({
    url: '/reward/main-type',
    method: 'post'
  })
}

export function getSubTypes(mainType) {
  return request({
    url: '/reward/sub-type',
    method: 'post',
    data: { mainType }
  })
}

export function sendReward(reward) {
  return request({
    url: '/reward/send',
    method: 'post',
    data: reward
  })
}

