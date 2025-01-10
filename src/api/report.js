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

const reportTypeMap = {
  0: '未成年人',
  1: '作弊',
  2: '骚扰',
  3: '歧视',
  4: '仇恨',
  5: '其他'
}


export function formatReportType(reportType) {
  if (reportType == null) {
    return '未成年人'
  }

  if (isNaN(reportType)) {
    return '未成年人'
  }

  return reportTypeMap[reportType] || '未定义'
}

export function reportTypes() {
  return reportTypeMap
}


export function getBanList(formData) {
  return request({
    url: '/ban/list',
    method: 'post',
    data: formData
  })
}

export function getBanUserList(formData) {
  return request({
    url: '/banuser/list',
    method: 'post',
    data: formData
  })
}


export function formatBanType(banType) {
  if (banType == null) {
    return '未成年人'
  }

  if (isNaN(banType)) {
    return '未成年人'
  }

  return banTypeMap[banType] || '未定义'
}

const banTypeMap = {
  0: '未成年人',
  1: '作弊',
  2: '骚扰',
  3: '歧视',
  4: '仇恨',
  5: '其他'
}
