import request from '@/utils/request'

export function getReports(formData) {
  return request({
    url: '/report/list',
    method: 'post',
    data: formData
  })
}

export function getOneReport(name) {
  return request({
    url: '/report/detail',
    method: 'post',
    data: { name }
  })
}

export function editReport(report) {
  return request({
    url: '/report/edit',
    method: 'post',
    data: report
  })
}

const typeMap = {
  0: '未成年人',
  1: '作弊',
  2: '骚扰',
  3: '歧视',
  4: '仇恨',
  5: '其他'
}


export function formatReportType(reportType) {
  return typeMap[reportType] || '未定义'
}

export function reportTypes() {
  return typeMap
}

