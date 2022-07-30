
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { clientLanguageKey } from '~/common/constaint';
import { $i18n } from '~/plugins/i18n.client';
import { $localForage } from '~/plugins/localforage.client';

@Module
export default class CompanyStore extends VuexModule {
    company = {}
    @Mutation
    updateCompany(company: object) {
        this.company = company
    }
    @Action({ rawError: true })
    async setCompany(company: object) {
        if (company) {
            console.log('vào đây', company);
            this.context.commit('updateCompany', company)
        }
    }
}