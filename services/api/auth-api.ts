import { IFetchAPI, IApiResponse } from "~/common/types/fetch-api.type"
import { resources, HTTP_METHOD } from "~/common/constaint"
import { LoginDTO, RegisterDTO, RenewTokenDto, ReceiveCodeDTO, VerifyMailDto, CodeForgotDTO, CreateNewPasswordDTO, LoginGoogleDTO } from "~/common/dtos/auth"

export type IAuthAPI = {
    login: (body: LoginDTO) => IApiResponse,
    loginGoogle: (body: LoginGoogleDTO) => IApiResponse
    register: (body: RegisterDTO) => IApiResponse,
    renewToken: (refreshToken: string) => IApiResponse,
    getOTP: (body: ReceiveCodeDTO) => IApiResponse,
    verifyMail: (body: VerifyMailDto) => IApiResponse
    forgotPassword: (email: string) => IApiResponse
    checkCodeForgot: (body: CodeForgotDTO) => IApiResponse
    createNewPassword: (body: CreateNewPasswordDTO) => IApiResponse
}

export const authAPI = ($fetchApi: IFetchAPI) => ({
    login: (body: LoginDTO) => $fetchApi({
        url: `${resources.Auth}/login`,
        method: HTTP_METHOD.POST,
        body
    }),
    loginGoogle: (body: LoginGoogleDTO) => $fetchApi({
        url: `${resources.Auth}/google`,
        method: HTTP_METHOD.POST,
        body
    }),
    register: (body: RegisterDTO) => $fetchApi({
        url: `${resources.Auth}/register`,
        method: HTTP_METHOD.POST,
        body
    }),
    getOTP: (body: ReceiveCodeDTO) => $fetchApi({
        url: `${resources.Auth}/receive-code`,
        method: HTTP_METHOD.POST,
        body
    }),
    verifyMail: (body: VerifyMailDto) => $fetchApi({
        url: `${resources.Auth}/verify`,
        method: HTTP_METHOD.POST,
        body
    }),
    renewToken: (refreshToken: string) => $fetchApi({
        url: `${resources.Auth}/renew-token`,
        method: HTTP_METHOD.POST,
        body: {
            refreshToken
        }
    }),
    forgotPassword: (email: string) => $fetchApi({
        url: `${resources.Auth}/forgot-password`,
        method: HTTP_METHOD.POST,
        body: {
            email
        }
    }),
    checkCodeForgot: (body: CodeForgotDTO) => $fetchApi({
        url: `${resources.Auth}/check-code-forgot`,
        method: HTTP_METHOD.POST,
        body
    }),
    createNewPassword: (body: CreateNewPasswordDTO) => $fetchApi({
        url: `${resources.Auth}/create-new-password`,
        method: HTTP_METHOD.POST,
        body
    })
})