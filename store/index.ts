
import { ActionTree } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import { Context } from '@nuxt/types/app'
// import AuthStore from './auth'
import { clientLanguageKey } from '~/common/constaint'
import LanguageStore from './language'

export const state = () => ({

})
export type RootState = ReturnType<typeof state>


export const actions: ActionTree<RootState, RootState> = {

    async nuxtClientInit({ commit }, { store, $localForage, app }: Context) {
        try {
            // const auth = getModule(AuthStore, store);
            const language = getModule(LanguageStore, store);
            ////console.log('Hoai')
            // const user = await $localForage.getItem(userInfoKey) || null
            let lang = await $localForage.getItem(clientLanguageKey);

            if (!lang) {
                //@ts-ignore
                lang = navigator.language || navigator.userLanguage;
                // if (!/^vi\b/.test(navigator.language)) {
                //     lang = "en"
                // }
                lang = 'vi'
            }
            language.swichLocale(lang)
        } catch (error) {
            ////console.log(error)
        }
    },
}