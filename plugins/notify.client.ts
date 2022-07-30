import Vue from 'vue'
import toastr from 'toastr'
import { Context } from '@nuxt/types';
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
    interface Vue {
        $notify(type: string, message: string): void
    }
}
declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $notify(type: string, message: string): void
    }
    interface Context {
        $notify(type: string, message: string): void
    }
}
function notify(type: string, text: string) {

    toastr.options = {
        closeButton: !0,
        debug: !0,
        newestOnTop: !0,
        progressBar: !0,
        positionClass: "toast-bottom-right",
        // @ts-ignore
        showDuration: "600",
        // @ts-ignore
        hideDuration: "1000",
        // @ts-ignore
        timeOut: "3000",
        // @ts-ignore
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    switch (type) {
        case 'success':
            text = `<i class="fas fa-check"></i>  ${text}`
            break;
        case 'info':
            text = `<i class="fas fa-info-circle"></i>  ${text}`
            break;
        case 'error':
            text = `<i class="fas fa-bug""></i>  ${text}`
            break;
        case 'warning':
            text = `<i class="fas fa-exclamation-triangle"></i>  ${text}`
            break;
        default:
    }
    // @ts-ignore
    toastr[type](text)
}

Vue.prototype.$notify = (type: string, message: string) => notify(type, message)

const notifyPlugin: Plugin = (context: Context, inject) => {
    inject('notify', notify)
}
export default notifyPlugin