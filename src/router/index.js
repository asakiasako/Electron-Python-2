import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Init from '@/views/Init.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'entry',
    path: '/',
    redirect: { name: 'init' }
  },
  {
    name: 'init',
    path: '/init',
    component: Init
  },
  {
    name: 'home',
    path: '/home',
    component: Home
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export default router
