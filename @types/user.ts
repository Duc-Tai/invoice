export type IUser = {
    email?: string;
    username?: string;
    balance?: number;
    role?: string
    expiresIn?: number
    apiKey?: string,
    twofa?: {
        enable: boolean
    }
    autoRenew?: false
    ownerAgency?: string
    agencyId?: string
    _id?:string
}