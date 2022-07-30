import { Context, Plugin } from '@nuxt/types'

import { IUltils, ultils } from '~/common/ultils'

declare module 'vue/types/vue' {
    interface Vue {
        $ultils: IUltils
    }
}
declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $ultils: IUltils
    }
    // nuxtContext.$ultils
    interface Context {
        $ultils: IUltils
    }
}


const ultilPlugin: Plugin = (ctx: Context, inject) => {
    inject('ultils', ultils(ctx))
}

export default ultilPlugin