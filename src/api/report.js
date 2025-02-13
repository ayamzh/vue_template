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
  0: 'Underage/未成年人',
  1: 'Cheating/作弊',
  2: 'Harassment/骚扰',
  3: 'Discrimination/歧视',
  4: 'Hateful/仇恨',
  5: 'Something/其他'
}


export function formatReportType(reportType) {
  if (reportType == null) {
    return 'Underage/未成年人'
  }

  if (isNaN(reportType)) {
    return 'Underage/未成年人'
  }

  return reportTypeMap[reportType] || '未定义'
}

export function reportTypes() {
  return {
    0: 'Underage/未成年人',
    5: 'Something/其他'
  }
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
    return 'Underage/未成年人'
  }

  if (isNaN(banType)) {
    return 'Underage/未成年人'
  }

  return banTypeMap[banType] || '未定义'
}

const banTypeMap = {
  0: 'Underage/未成年人',
  1: 'Cheating/作弊',
  2: 'Harassment/骚扰',
  3: 'Discrimination/歧视',
  4: 'Hateful/仇恨',
  5: 'Something/其他'
}
