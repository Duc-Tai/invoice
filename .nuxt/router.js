import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4b0faccb = () => interopDefault(import('..\\pages\\home\\index.vue' /* webpackChunkName: "pages/home/index" */))
const _123ebe85 = () => interopDefault(import('..\\pages\\onboaring\\index.vue' /* webpackChunkName: "pages/onboaring/index" */))
const _275b9b22 = () => interopDefault(import('..\\pages\\home\\create-invoice\\index.vue' /* webpackChunkName: "pages/home/create-invoice/index" */))
const _74f8e989 = () => interopDefault(import('..\\pages\\home\\edit-invoice\\_id.vue' /* webpackChunkName: "pages/home/edit-invoice/_id" */))
const _0ed22e29 = () => interopDefault(import('..\\pages\\home\\preview-invoice\\_id.vue' /* webpackChunkName: "pages/home/preview-invoice/_id" */))
const _6ad0c68a = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/home",
    component: _4b0faccb,
    name: "home"
  }, {
    path: "/onboaring",
    component: _123ebe85,
    name: "onboaring"
  }, {
    path: "/home/create-invoice",
    component: _275b9b22,
    name: "home-create-invoice"
  }, {
    path: "/home/edit-invoice/:id?",
    component: _74f8e989,
    name: "home-edit-invoice-id"
  }, {
    path: "/home/preview-invoice/:id?",
    component: _0ed22e29,
    name: "home-preview-invoice-id"
  }, {
    path: "/",
    component: _6ad0c68a,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
