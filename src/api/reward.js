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

export function sendRewardBatch(formData) {
  return request({
    url: '/reward/batch', // 修改为实际上传文件的接口
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

export function getRecords() {
  return request({
    url: '/reward/records',
    method: 'post'
  })
}

