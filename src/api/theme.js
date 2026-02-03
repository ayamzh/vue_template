import request from '@/utils/request'

/**
 * 机台数据拷贝：从源用户拷贝指定机台的 theme_status 到目标用户（同一机台）
 * @param {Object} data - { fromUid, toUid, fromThemeId }
 */
export function themeCopy(data) {
  return request({
    url: '/theme/copy',
    method: 'post',
    data
  })
}
