import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    name: 'Admin',
    meta: { title: '系统管理', icon: 'el-icon-s-help', roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/admin/index'),
        meta: { title: '账号', icon: 'table', roles: ['admin'] }
      },
      {
        path: 'oplog',
        name: 'Oplog',
        component: () => import('@/views/oplog/index'),
        meta: { title: '操作日志', icon: 'table' }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  {
    path: '/passport',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Passport',
        component: () => import('@/views/passport/index'),
        meta: { title: '账号表', icon: 'el-icon-user-solid' }
      }
    ]
  },

  {
    path: '/player',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Player',
        component: () => import('@/views/player/index'),
        meta: { title: '用户表', icon: 'el-icon-user' }
      }
    ]
  },

  {
    path: '/reward',
    component: Layout,
    redirect: '/reward/send-simple',
    name: 'Reward',
    meta: { title: '奖励发放', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'send-simple',
        name: 'send-simple',
        component: () => import('@/views/reward/send-simple'),
        meta: { title: '简单发放', icon: 'el-icon-s-promotion' }
      },
      {
        path: 'send-batch',
        name: 'send-batch',
        component: () => import('@/views/reward/send-batch'),
        meta: { title: '批量发放', icon: 'el-icon-s-promotion' }
      }
    ]
  },

  {
    path: '/mail',
    component: Layout,
    redirect: '/mail/send-simple',
    name: 'Mail',
    meta: { title: '邮件发放', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'send-simple',
        name: 'mail-send-simple',
        component: () => import('@/views/mail/send-simple'),
        meta: { title: '邮件发放', icon: 'el-icon-s-promotion' }
      }
    ]
  },

  {
    path: '/report',
    component: Layout,
    redirect: '/report/index',
    name: 'Report',
    meta: { title: '举报系统', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/report/index'),
        meta: { title: '举报记录', icon: 'el-icon-s-promotion' }
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/report/detail'),
        meta: { title: '处置用户', icon: 'el-icon-s-promotion' }
      },
      {
        path: 'ban',
        name: 'ban',
        component: () => import('@/views/report/ban'),
        meta: { title: '处置记录', icon: 'el-icon-s-promotion' }
      },
      {
        path: 'banuser',
        name: 'banuser',
        component: () => import('@/views/report/banuser'),
        meta: { title: '已处置用户', icon: 'el-icon-s-promotion' }
      }
    ]
  },

  {
    path: '/tools',
    component: Layout,
    redirect: '/tools/ride-rule',
    name: 'Tools',
    meta: { title: '工具集', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'ride-rule',
        name: 'ride-rule',
        component: () => import('@/views/tools/ride-rule'),
        meta: { title: '规则引擎', icon: 'form' }
      },
      {
        path: 'domainCheck',
        name: 'domainCheck',
        component: () => import('@/views/tools/domain-check'),
        meta: { title: '证书检查', icon: 'form' }
      },
      {
        path: 'rtpSimulator',
        name: 'rtpSimulator',
        component: () => import('@/views/tools/rtp-simulator'),
        meta: { title: 'RTP模拟器', icon: 'form' }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/password',
    name: 'Setting',
    meta: { title: '设置', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'password',
        name: 'password',
        component: () => import('@/views/password/index'),
        meta: { title: '修改密码', icon: 'el-icon-s-tools' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  {
    path: 'External-Link',
    component: Layout,
    name: 'External-Link',
    meta: { title: '外链', icon: 'nested' },
    children: [
      {
        path: 'http://vb.pmt.centurygame.io/pmt#/pmconf/conf_builder',
        meta: { title: '配置表管理', icon: 'link' }
      },
      {
        path: 'http://vb.pmt.centurygame.io/pmt#/visitor/database',
        meta: { title: '数据库访问', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
