/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:35:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 15:43:51
 */ 
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

// const VueRouterPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return VueRouterPush.call(this, location).catch(err => err)
// }

// const VueRouterReplace = Router.prototype.replace
// Router.prototype.replace = function replace (location) {
//   return VueRouterReplace.call(this, location).catch(err => err)
// }

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})


router.beforeEach((to, from, next) => {
    to,
    from,
    next()
})

router.afterEach(to => {
    to;
})

export default router
