export type LoginDTO = {
    // username: string
    password: string
    email: string
    code: string
    captcha: string
}

export type RegisterDTO = {
    // code: string
    email: string
    password: string
    // coupon: string,
}
export type ReceiveCodeDTO = {
    email: string
    password: string
    // coupon: string
    // ref: string
}
export type VerifyMailDto = {
    token: string
}
export type RenewTokenDto = {
    refreshToken: string
}
export type CodeForgotDTO = {
    email: string
    code: string
}
export type CreateNewPasswordDTO = {
    password: string
    token: string
}
export type LoginGoogleDTO = {
    id_token: string,
}