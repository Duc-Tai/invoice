import param from './param'
export const objectToParam = (obj: object) => param(obj)
const jwt = require('jsonwebtoken')
const numeral = require('numeral');

import { Context } from '@nuxt/types';


export type IUltils = {
    formatCurrency: (price: number) => string
}
export const isTokenExpired = async (token: string) => {
    let { exp } = jwt.decode(token)
    const now = Date.now().valueOf() / 1000
    return now > exp
}

export const ultils = (ctx: Context) => ({

    formatCurrency: (price: number) => {
        return `${numeral(price).format('0,0[.]000')}`
    }
})


