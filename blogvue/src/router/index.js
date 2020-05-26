import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: lasyLoad('Home') },
  { path: '/articlelist', name: 'ArticleList', component: lasyLoad('ArticleList') },
  { path: '/articledetail', name: 'ArticleDetail', component: lasyLoad('ArticleDetail') },
  { path: '/about', name: 'About', component: lasyLoad('About') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * 实现路由懒加载的工具函数
 * @param {string} viewPath  view的相对路径，相对于src目录
 */
function lasyLoad (viewPath) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${viewPath}.vue`)
}

export default router
