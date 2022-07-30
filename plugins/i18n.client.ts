import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Plugin, Context } from '@nuxt/types'
Vue.use(VueI18n)

let $i18n: VueI18n
const Repository: Plugin = (ctx: Context, inject) => {
  const { store, app } = ctx;
  $i18n = new VueI18n({
    locale: store.state.language.locale,
    fallbackLocale: 'vi',
    messages: {
      'en': require('~/locales/en.json'),
      'vi': require('~/locales/vi.json')
    },
  });
  app.i18n = $i18n
}
export { $i18n }
export default Repository