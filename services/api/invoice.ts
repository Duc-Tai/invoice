import { IFetchAPI, IApiResponse } from "~/common/types/fetch-api.type"
import { resources, HTTP_METHOD } from "~/common/constaint"
import { ICompanyCreateDTO } from "~/common/dtos/conpany"
import { objectToParam } from "~/common/ultils";

export type IInvoiceAPI = {
    createInvoice: (body: any) => IApiResponse
    getInvoiceOne: (invoiceId: string) => IApiResponse
    getInvoiceReport: (companyId: string) => IApiResponse
    getInvoiceAll: (query: any) => IApiResponse
    deleteInvoiceOne: (invoiceId: string) => IApiResponse
    deleteInvoiceAll: (companyId: string) => IApiResponse
    updateInvoice: (body: any, invoiceId: string) => IApiResponse
}

export const invoiceAPI = ($fetchApi: IFetchAPI) => ({
    createInvoice: (body: any) => $fetchApi({
        url: `${resources.Invoice}/create`,
        method: HTTP_METHOD.POST,
        body
    }),
    getInvoiceReport: (companyId: string) => $fetchApi({
        url: `${resources.Invoice}/report/${companyId}`,
        method: HTTP_METHOD.GET,
    }),
    getInvoiceOne: (invoiceId: string) => $fetchApi({
        url: `${resources.Invoice}/one/${invoiceId}`,
        method: HTTP_METHOD.GET,
    }),
    getInvoiceAll: (query: any) => $fetchApi({
        url: `${resources.Invoice}/all?${objectToParam(query)}`,
        method: HTTP_METHOD.GET,
    }),
    deleteInvoiceOne: (invoiceId: string) => $fetchApi({
        url: `${resources.Invoice}/delete/one/${invoiceId}`,
        method: HTTP_METHOD.DELETE,
    }),
    deleteInvoiceAll: (companyId: string) => $fetchApi({
        url: `${resources.Invoice}/delete/all/companyId=${companyId}`,
        method: HTTP_METHOD.DELETE,
    }),
    updateInvoice: (body: any, invoiceId: string) => $fetchApi({
        url: `${resources.Invoice}/update/${invoiceId}`,
        method: HTTP_METHOD.PUT,
        body
    }),
})