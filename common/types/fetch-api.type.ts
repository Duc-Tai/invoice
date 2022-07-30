export type IFetchAPIParam = {
    url: string
    body?: object
    method: string
}
export type IFetchAPI = (param: IFetchAPIParam) => IApiResponse;

export type IaxiosOption = {
    url: string
    data?: any
    method: string
}
export type IobjectResponse = {
    page?: number
    total?: number
    totalInList?: number
    data?: any
}
export type IApiResponse = {
    data: any | IobjectResponse | object
}
export type BaseQuery = {
    filter?: any
    limit?: number
    page?: number
    search?: string
}

export type Pagination = {
    page: number
    totalPage: number
    limit: number
    from: number
    to: number
    totalItem: number
}