import { Context, Plugin } from '@nuxt/types'

import localforage from "localforage";

 
declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $localForage: LocalForage
    }
    interface Context {
        $localForage: LocalForage
    }
}

let $localForage: LocalForage

const localforagePlugin: Plugin = (ctx: Context, inject) => {
    const localforageFn = {
        setItem(key: string, value: any) {
            return ctx.$localForage.setItem(key, value)
        },
        getItem(key: string) {
            return ctx.$localForage.getItem(key)
        }
    }
    //@ts-ignore
    $localForage = localforageFn
    inject('localforage', localforageFn)
}

export { $localForage }
export default localforagePlugin
