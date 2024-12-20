import request from '@/utils/request'

export function getReports(formData) {
  return request({
    url: '/report/list',
    method: 'post',
    data: formData
  })
}

export function formatReportType(reportType) {
  const typeMap = {
    0: '未成年人',
    1: '作弊',
    2: '骚然',
    3: '歧视',
    4: '仇恨',
    5: '其他'
  }
  return typeMap[reportType] || '未定义'
}
