import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_token'
const AdminNameKey = 'vue_admin_name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAdminName() {
  return Cookies.get(AdminNameKey)
}

export function setAdminName(adminName) {
  return Cookies.set(AdminNameKey, adminName)
}

export function removeAdminName() {
  return Cookies.remove(AdminNameKey)
}

