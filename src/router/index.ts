import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

import * as DropboxSync from "../src/dropboxSync"

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
    ,beforeEnter: (to, from, next) => {
      if (window.location.href.search("access_token") > -1){
        DropboxSync.setAccessTokenFromUrl();
        next({
          name: "dropboxsync" 
        });
      } else {
        next()
      }
      
      
      
      
      
    }
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
  { path: '*', redirect: '/' }, 
  
]

const router = new VueRouter({
  //mode: 'history',
  base: "/desktop-search/",
  routes
})

export default router
