const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  // name: state => state.user.name,
  adminName: state => state.user.adminName,
  serverEnv: state => state.user.serverEnv,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes// 新增
}
export default getters
