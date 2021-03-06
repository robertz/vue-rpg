import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Character from './views/Character.vue'
import Combat from './views/Combat.vue'
import Mobs from './views/Mobs.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/character',
      name: 'character',
      component: Character
    }, {
      path: '/combat',
      name: 'combat',
      component: Combat
    }, {
      path: '/mobs',
      name: 'mobs',
      component: Mobs
    }, {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
