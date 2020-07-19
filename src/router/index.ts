import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/localBookmarkList',
    name: "localBookmarkList",
    props: true ,
    component: () => import('../views/LocalBookmarkList.vue')
  },
  {
    path: '/localBookmark/:id',
    name: "localBookmark",
    props: true ,
    component: () => import('../views/LocalBookmark.vue')
  },
  {
    path: '/Admin',
    name: "admin",
    props: true ,
    component: () => import('../views/Admin.vue')
  },

  
]

const router = new VueRouter({
  routes
})

export default router
