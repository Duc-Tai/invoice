import { IFetchAPI, IApiResponse } from "~/common/types/fetch-api.type";
import { authAPI, IAuthAPI } from "./auth-api";
import { companyAPI, ICompanyAPI } from "./conpany"
import { invoiceAPI, IInvoiceAPI } from "./invoice"
export type IcreatedRepository = {
    authAPI: IAuthAPI,
    companyAPI: ICompanyAPI,
    invoiceAPI: IInvoiceAPI
}
export const createdRepository = ($fetchApi: IFetchAPI) => ({
    authAPI: authAPI($fetchApi),
    companyAPI: companyAPI($fetchApi),
    invoiceAPI: invoiceAPI($fetchApi)
})
