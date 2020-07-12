Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: lazyLoad('Home') },
  { path: '/articlelist', name: 'ArticleList', component: lazyLoad('ArticleList') },
  { path: '/articledetail', name: 'ArticleDetail', component: lazyLoad('ArticleDetail') },
  { path: '/about', name: 'About', component: lazyLoad('About') },
  { path: '/noveldetail', name: 'NovelDetail', component: lazyLoad('NovelDetail') },
  { path: '/chapterdetail', name: 'ChapterDetail', component: lazyLoad('ChapterDetail') },
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
function lazyLoad (viewPath) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${viewPath}.vue`)
}

export default router
