import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { IUser } from '~/@types/user';
import { accessTokenKey, refreshTokenKey, userInfoKey } from '~/common/constaint';
import { LoginDTO, RegisterDTO } from '~/common/dtos/auth';
import { $localForage } from '~/plugins/localforage.client';
import { $API } from '~/plugins/repository';
import { $axios } from '~/common/ultils/axios';



@Module({
    name: 'auth',
    namespaced: true,
    stateFactory: true
})
export default class AuthStore extends VuexModule {
    accessToken: string | null = null;
    refreshToken: string | null = null;
    user: IUser | null = null;
    proxy: object = {}
    get isLogin() {
        return !!this.accessToken;
    }
    @Mutation
    async setKey(key: string) {
        if (this.user?.apiKey) {
            this.user.apiKey = key
            await $localForage.setItem(userInfoKey, this.user)
        }
    }
    @Mutation
    setUser(user: object) {
        if (user) {
            this.user = user
        }
    }
    @Mutation
    setAgency(agency: object) {
        // if(agency){
        //     this.user = {
        //         ...this.user,
        //         ownerAgency: {
        //             ...agency
        //         }
        //     }
        // }
        console.log('agency :>> ', agency);
    }
    @Mutation
    async editAccount({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) {
        //console.log(accessToken, 'accessToken');
        //console.log(refreshToken, 'refreshToken');
        this.accessToken = accessToken;
        this.refreshToken = refreshToken
        await $localForage.setItem(accessTokenKey, accessToken)
        await $localForage.setItem(refreshTokenKey, refreshToken)
        await $axios.setHeader("Authorization", `Bearer ${accessToken}`);
    }
    @Mutation
    setInfoProxy(proxy: object) {
        if (proxy) {
            this.proxy = proxy
        }
    }
    @Mutation
    removeInfoProxy(value: boolean) {
        if (value) {
            this.proxy = {}
        }
    }
    @Mutation
    userLogout() {
        try {
            this.accessToken = null
            this.refreshToken = null
            this.user = null
        } catch (error) {
            ////console.log(error)

        }
    }
    @Mutation
    async Authorization({ accessToken, refreshToken, user }: { accessToken: string, refreshToken: string, user: IUser }) {
        this.accessToken = accessToken
        this.user = user
        this.refreshToken = refreshToken
    }
    @Mutation
    async setAccessToken(accessToken: string) {
        this.accessToken = accessToken
    }
    // @Action({ rawError: true })
    // async onHandleMoneyChanges() {
    //     try {
    //         const response = await $API.userAPI.getMoney();
    //         if (response?.data) {
    //             const user = response.data
    //             this.setUser(user)
    //             await $localForage.setItem(userInfoKey, user)
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    @Action({ rawError: true })
    async loginAccount({ typeLogin, params }: { typeLogin: string, params: any }) {
        try {
            //@ts-ignore
            let response: IApiResponse = null
            if (typeLogin === "google") {
                response = await $API.authAPI.loginGoogle(params);
            } else {
                response = await $API.authAPI.login(params);
            }
            let {
                data: {
                    //@ts-ignore
                    tokens: { accessToken, refreshToken },
                    user = null
                } = {},
            } = response;
            this.Authorization({ accessToken, refreshToken, user })
            await $localForage.setItem(accessTokenKey, accessToken)
            await $localForage.setItem(refreshTokenKey, refreshToken)
            await $localForage.setItem(userInfoKey, user)
            return true
        } catch (error) {
            throw error;
        }
    }
    @Action({ rawError: true })
    async renewAccessToken() {
        try {
            const refreshToken = await $localForage.getItem(refreshTokenKey);
            if (!refreshToken) {
                return this.Logout()
            }
            const response = await $API.authAPI.renewToken(refreshToken as string);
            let accessToken
            if (response?.data?.token) {
                accessToken = response.data.token
            } else {
                throw new Error()
            }
            //console.log('accessTokenKey :>> ', accessToken);
            this.setAccessToken(accessToken)
            $axios.setHeader("Authorization", `Bearer ${accessToken}`);
            await $localForage.setItem(accessTokenKey, accessToken)
            return accessToken
        } catch (error) {
            this.Logout()
            throw error
        }
    }
    @Action({ rawError: true })
    async register(params: RegisterDTO) {
        try {
            const response = await $API.authAPI.register(params);
            return true
        } catch (error) {
            throw error;
        }
    }
    @Action({ rawError: true })
    async Logout() {
        try {
            await $localForage.setItem(accessTokenKey, null)
            await $localForage.setItem(refreshTokenKey, null)
            await $localForage.setItem(userInfoKey, null)
            this.userLogout();
        } catch (error) {
            ////console.log(error)
        }
    }
}