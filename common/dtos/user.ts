
export type RegisterDTO = {
    username: string
    password: string

}
export type UpdateUserDTO = {
    oldPassword: string
    newPassword: string
}
export type UpdateAdminUserDTO = {
    adminId: string,
    password: string
}
export type RemoveUserDTO = {
    adminIds: string[]
}
export type reNewTimeDTO = {
    duration: number
}
export type renewTimeUserDTO = {
    userId: string
    duration: number
}
export type AdminUpdateUserDto = {
    userId: string
    balance?: number
    active?: boolean
}
export type AdminTopUpDto = {
    userId: string
    amount: number
    bill: string
}

export type AdminActiveDto = {
    userId: string
}
export type PaymentCreditCardDTO = {
    amount: number
}
export type PaymentPaypalDTO = {
    amount: number
}
export type CompletePaypalPaymentDTO = {
    paymentID: string
    payerID: string
}