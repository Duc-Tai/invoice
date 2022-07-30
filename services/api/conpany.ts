import { IFetchAPI, IApiResponse } from "~/common/types/fetch-api.type"
import { resources, HTTP_METHOD } from "~/common/constaint"
import { ICompanyCreateDTO, ICompanyUpdateDTO } from "~/common/dtos/conpany"
import { objectToParam } from "~/common/ultils";

export type ICompanyAPI = {
    createCompany: (body: any) => IApiResponse
    updateCompany: (body: any, companyId: string) => IApiResponse
    getCompany: (companyId: string) => IApiResponse
}

export const companyAPI = ($fetchApi: IFetchAPI) => ({
    createCompany: (body: any) => $fetchApi({
        url: `${resources.Company}/create`,
        method: HTTP_METHOD.POST,
        body
    }),
    updateCompany: (body: any, companyId: string) => $fetchApi({
        url: `${resources.Company}/update/${companyId}`,
        method: HTTP_METHOD.PUT,
        body
    }),
    getCompany: (companyId: string) => $fetchApi({
        url: `${resources.Company}/me?companyId=${companyId}`,
        method: HTTP_METHOD.GET,
    })
})