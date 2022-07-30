import Vue from 'vue'
import VueLocalforage from 'v-localforage'

Vue.use(VueLocalforage, {"name":"nuxtJS","storeName":"nuxtLocalForage"})

export default (ctx, inject) => {
  inject('localForage', Vue.$localforage)
}
