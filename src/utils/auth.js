import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_token'
const AdminIDKey = 'vue_admin_id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAdminID() {
  return Cookies.get(AdminIDKey)
}

export function setAdminID(adminID) {
  return Cookies.set(AdminIDKey, adminID)
}

export function removeAdminID() {
  return Cookies.remove(AdminIDKey)
}

