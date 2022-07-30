import { IFetchAPI, IaxiosOption } from "~/common/types/fetch-api.type";
import { Context } from "@nuxt/types";
import { HTTP_METHOD } from "~/common/constaint";
import { objectToParam } from "~/common/ultils";
import * as _ from 'lodash'
import { Plugin } from '@nuxt/types'
import { $i18n } from "./i18n.client"
import { fromPairs } from "lodash";
declare module 'vue/types/vue' {
    interface Vue {
        $fetchAPI: IFetchAPI
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $fetchAPI: IFetchAPI
    }
    interface Context {
        $fetchAPI: IFetchAPI
    }
}
declare module 'vuex/types/index' {
    interface Store<S> {
        $fetchAPI: IFetchAPI
    }
}
const fetchAPI: Plugin = (context: Context, inject) => {
    const fetchAPI = async (
        { url, body = {}, method = HTTP_METHOD.GET }: { url: string, body?: object, method: string }
    ) => {
        try {
            const $axios = context.$axios
            let axiosOption: IaxiosOption = {
                url: url,
                method: method,
            }
            if (_.size(body)) {
                axiosOption.data = body
            }
            //@ts-ignore
            let response: IApiResponse = await $axios(axiosOption)
            if (response?.data) {
                return response.data
            }
        } catch (error) {
            // ////console.log('error :>> ', error);
            // if (error?.response?.data?.message) {
            //     ////console.log(error.response.data.message, 'ERROR FETCH API')
            //     const message = error.response.data.message;
            //     //console.log(message, 'message');
            //     context.$notify("error", message);
            // } else {
            //     context.$notify("error", 'Có Lỗi Xảy Ra');
            // }
            console.log('error.response :>> ', error.response);
            if (error?.response?.data?.message) {
                const message = error.response.data.message;
                // const errorResponseVi = $i18n.messages.vi.serverResponse
                const errorResponseEn = $i18n.messages.en.serverResponse
                //@ts-ignore
                context.$notify("error", errorResponseEn[message]);
                // if ($i18n.locale == 'vi') {
                //     //@ts-ignore
                //     context.$notify("error", errorResponseVi[message]);
                // } else {
                //     //@ts-ignore
                //     context.$notify("error", errorResponseEn[message]);
                // }
            } else {
                context.$notify("error", 'An error occurred');
            }
            throw error
        }
    }
    inject('fetchAPI', fetchAPI)
}

export default fetchAPI