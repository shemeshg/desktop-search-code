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
  {
    path: '/Dropboxsync',
    name: "dropboxsync",
    props: true ,
    component: () => import('../views/Dropboxsync.vue')
  },  
  
]

const router = new VueRouter({
  mode: 'history',
  base: "/desktop-search/",
  routes
})

export default router
