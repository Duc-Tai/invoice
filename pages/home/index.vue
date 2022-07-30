<template src="./template.html"></template>
<script lang="ts">
import LangStore from "~/store/language";
import { getModule, Watch } from "nuxt-property-decorator";
import { Component, Vue } from "nuxt-property-decorator";
import { $localForage } from "~/plugins/localforage.client";
import { companyImageKey, companyKey } from "~/common/constaint";
import moment from "moment";
import { updateImage } from "~/common/ultils/image";
@Component({
    middleware: "authenticated-home",
    components: {},
})
export default class Home extends Vue {
    tab = 0;
    config = {
        page: 1,
        limit: 25,
        search: "",
        companyId: "",
        filter: {
            paymentStatus: "all",
        },
    };
    totalPage: number = 0;

    sheet = false;

    filter = "all";

    listInvoices = [];
    invoices = {};

    dialogDelete = false;
    dialogPrivacyPolicies = false;
    loading = false;
    loadingTable = false;
    image = null;
    url = null;

    companyId: string = "";

    company = {
        name: "",
        phoneNumber: "",
        image: "",
    };

    payloadReport: any = {};

    async mounted() {
        const companyId: any = await $localForage.getItem(companyKey);
        if (companyId) {
            this.companyId = companyId;
        }
        await this.getCompany();
        this.getInvoiceAllCompany();
        this.getReportInvocie();
    }

    async getCompany() {
        try {
            const response = await this.$API.companyAPI.getCompany(
                this.companyId
            );
            console.log("response :>> ", response);
            if (response) {
                $localForage.setItem(companyKey, response.data._id);
                $localForage.setItem(companyImageKey, response.data.image);
                this.company = response.data;
                console.log("this.company :>> ", this.company);
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    }

    async getInvoiceAllCompany() {
        try {
            this.loadingTable = true;
            if (this.companyId) {
                this.config.companyId = this.companyId;
            }
            if (this.filter === "all") {
                //@ts-ignore
                delete this.config.filter.paymentStatus;
            } else {
                this.config.filter.paymentStatus = this.filter;
            }
            const response = await this.$API.invoiceAPI.getInvoiceAll(
                this.config
            );
            const { page, total, totalInList, data } = response.data;
            this.totalPage = Math.ceil(total / this.config.limit);
            if (response?.data?.data) {
                this.listInvoices = response.data.data;
            }
        } catch (error) {
            console.log("error :>> ", error);
        } finally {
            this.loadingTable = false;
        }
    }
    async getReportInvocie() {
        try {
            const response = await this.$API.invoiceAPI.getInvoiceReport(
                this.companyId
            );
            if (response) {
                this.payloadReport = response.data.reportSum[0];
                console.log("this.payloadReport :>> ", this.payloadReport);
            }
            console.log("response :>> ", response);
        } catch (error) {}
    }
    onSelectImage() {
        //@ts-ignore
        this.$refs.selectImage.$refs.input.click();
    }

    onChangeImage(e: any) {
        this.image = e;
        //@ts-ignore
        this.url = URL.createObjectURL(this.image);
        this.company = {
            ...this.company,
            //@ts-ignore
            image: this.url,
        };
        this.updateCompany();
    }

    setInvoices(invoices: any) {
        if (invoices) {
            this.invoices = invoices;
            this.sheet = true;
        }
    }
    getImage() {
        if (this.url) {
            return this.url;
        }
        return `${window.location.origin}/${this.company.image}`;
    }
    calcPrice(invoice: any) {
        let price = 0;
        if (invoice) {
            const { items, payment } = invoice;
            for (let item of items) {
                price += item.price;
            }
            if (payment && payment.discount) {
                if (payment.discount.value) {
                    price -= payment.discount.value;
                }
            }
            if (payment && payment.shipping) {
                if (payment.shipping.value) {
                    price += payment.shipping.value;
                }
            }
            if (payment && payment.tax) {
                if (payment.tax.value) {
                    price += payment.tax.value;
                }
            }
        }
        return price;
    }
    get calPriceInvoiceDetail() {
        let price = 0;
        console.log("this.invoices :>> ", this.invoices);
        if (this.invoices) {
            //@ts-ignore
            const { items, payment } = this.invoices;
            if (!items || !payment) return 0;
            for (let item of items) {
                price += item.price;
            }
            if (payment && payment.discount) {
                if (payment.discount.value) {
                    price -= payment.discount.value;
                }
            }
            if (payment && payment.shipping) {
                if (payment.shipping.value) {
                    price += payment.shipping.value;
                }
            }
            if (payment && payment.tax) {
                if (payment.tax.value) {
                    price += payment.tax.value;
                }
            }
        }
        return price;
    }
    formatDate(milliseconds: number) {
        return moment.unix(milliseconds).format("DD/MM/YYYY");
    }
    async updateCompany() {
        try {
            if (this.tab === 2) {
                const regexNumberPhone =
                    /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
                //@ts-ignore
                if (!regexNumberPhone.test(this.company.phoneNumber)) {
                    return this.$notify(
                        "error",
                        "Please enter a valid phone number"
                    );
                }
                var data = new FormData();
                data.append("name", this.company.name);
                data.append("phoneNumber", this.company.phoneNumber);
                //@ts-ignore
                data.append("file", this.image);
                const response: any = await updateImage(
                    `company/update/${this.companyId}`,
                    "put",
                    data
                );
                if (response.data) {
                    $localForage.setItem(companyKey, response.data._id);
                }
                // await this.$API.companyAPI.updateCompany(
                //     this.company,
                //     this.companyId
                // );
                // this.$notify("success", "Successfully updated");
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    }

    async onDelete() {
        try {
            this.loading = true;
            console.log("this.invoices :>> ", this.invoices);
            await this.$API.invoiceAPI.deleteInvoiceOne(
                //@ts-ignore
                this.invoices._id
            );
            // this.$notify("success", "Delete invoice successfully");
            this.invoices = {};
            this.dialogDelete = false;
            this.sheet = false;
            this.getInvoiceAllCompany();
        } catch (error) {
            console.log("error :>> ", error);
        }
    }

    async onDeleteImage() {
        this.url = null;
        //@ts-ignore
        this.image = null;
    }

    get totalPaid() {
        let price = 0;
        if (this.payloadReport) {
            console.log("this.payloadReport :>> ", this.payloadReport);
            price =
                this.payloadReport.sumSubtotal +
                this.payloadReport.sumTax +
                this.payloadReport.sumShipping -
                this.payloadReport.sumDiscount;
            return price.toFixed(2);
        }
        return 0;
    }
    @Watch("filter")
    changeFilter() {
        this.getInvoiceAllCompany();
    }
}
</script>

<style>
.menuFilter {
    background-color: #ffffff !important;
}

#button-create-invoices {
    position: fixed;
    width: 56px;
    height: 56px;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%, -5%);
    /* right: calc(100% - 217px);
    bottom: 48px; */
    background: #3cae69;
    box-shadow: 0px 0.25px 3px rgba(0, 0, 0, 0.039),
        0px 2.75px 9px rgba(0, 0, 0, 0.19);
    border-radius: 16px;
}
.border-bottom-invoices {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.sheet-invoices .v-sheet {
    border-radius: 6px 6px 0px 0px;
}
.scrollListInvoice {
    max-height: 622px;
    overflow-y: scroll;
}
</style>
