
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { clientLanguageKey } from '~/common/constaint';
import { $i18n } from '~/plugins/i18n.client';
import { $localForage } from '~/plugins/localforage.client';

@Module({
    name: 'language',
    namespaced: true,
    stateFactory: true
})
export default class LanguageStore extends VuexModule {
    locale: string = "vi";
    locales: string[] = ["vi", "en"]
    @Mutation
    setLocale(locale: string) {
        this.locale = locale
        $i18n.locale = locale
    }
    @Action
    async swichLocale(locale: any) {
        await $localForage.setItem(clientLanguageKey, locale)
        this.setLocale(locale)
    }
}