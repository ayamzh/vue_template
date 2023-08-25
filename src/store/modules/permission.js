import { asyncRoutes, constantRoutes } from '@/router'

// 筛选路由
// 匹配权限
function hasPermission(role, route) {
  // 在路由上找的到 route.mate 和 route.mate.roles
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  } else {
    return true
  }
}

// 通过递归过滤异步路由表

export function filterAsyncRoutes(routes, role) {
  // 装筛选出来的路由
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // 将过滤的路由和国定的路由存起来
  }
}

// 筛选
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 因为我不同角色有不同的路由，不需要全部显示，所以就直接赋值了，如果需要admin全部显示的话，可以看看下面的
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // // 路由是否为 admin, 有直接全部显示
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   // 过滤路由
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

