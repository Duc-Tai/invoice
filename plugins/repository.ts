import { Plugin, Context } from '@nuxt/types'
import { IcreatedRepository } from '~/services/api'
import { createdRepository } from '~/services/api'


declare module 'vue/types/vue' {
    interface Vue {
        $API: IcreatedRepository
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $API: IcreatedRepository
    }
    interface Context {
        $API: IcreatedRepository
    }
}
declare module 'vuex/types/index' {
    interface Store<S> {
        $API: IcreatedRepository
    }
}
let $API: IcreatedRepository
const Repository: Plugin = (ctx: Context, inject) => {
    inject('API', createdRepository(ctx.$fetchAPI))
    $API = createdRepository(ctx.$fetchAPI)
}
export { $API }
export default Repository