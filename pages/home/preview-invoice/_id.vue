<template src="./template.html"></template>
<script lang="ts">
import LangStore from "~/store/language";
import { getModule, Watch } from "nuxt-property-decorator";
import { Component, Vue } from "nuxt-property-decorator";
import moment from "moment";
import html2canvas from "html2canvas";
import { $localForage } from "~/plugins/localforage.client";
import { companyKey } from "~/common/constaint";
const html2pdf = require("html2pdf.js");
@Component({
    middleware: "authenticated-home",
    components: {},
    layout: "createInvoice",
})
export default class PreviewInvoice extends Vue {
    listInvoice = [
        { name: "Item Name 1 2", quantity: 4, price: 250, total: 1000 },
        { name: "Item Name 1 2", quantity: 4, price: 250, total: 1000 },
    ];
    invoiceId = "";
    invoice: any = {};
    companyId: any = "";
    company: any = {};

    async mounted() {
        const companyId = await $localForage.getItem(companyKey);
        console.log("companyId :>> ", companyId);
        if (companyId) {
            this.companyId = companyId;
        }
        const { id } = this.$route.params;
        if (id) {
            this.invoiceId = id;
        }
        await this.getCompany();
        this.getInvoice();
    }

    async getCompany() {
        try {
            const response = await this.$API.companyAPI.getCompany(
                this.companyId
            );
            if (response) {
                this.company = response.data;
            }
        } catch (error) {}
    }
    async getInvoice() {
        try {
            const response = await this.$API.invoiceAPI.getInvoiceOne(
                this.invoiceId
            );
            if (response) {
                this.invoice = response.data;
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    }
    async saveFile() {
        const element = document.getElementById("preview-invoice");
        const opt = {
            margin: 1,
            filename: "invoice.pdf",
            image: {
                type: "jpeg",
                quality: 0.98,
            },
            html2canvas: {
                scale: 2,
            },
            jsPDF: {
                unit: "in",
                format: "letter",
                orientation: "portrait",
            },
        };
        html2pdf(element, opt);
        // html2canvas(document.body).then(async function (canvas) {
        //     const base64image = await canvas.toDataURL("image/png");
        //     console.log("base64image :>> ", base64image);
        //     var a = document.createElement("a"); //Create <a>
        //     a.href = "data:image/png;base64," + base64image; //Image Base64 Goes here
        //     a.download = "Image.pdf"; //File name Here
        //     a.click(); //Downloaded file
        // });
    }

    get priceSubTotal() {
        let price = 0;
        const items = this.invoice.items;
        if (items && items.length) {
            //@ts-ignore
            for (let item of this.invoice.items) {
                //@ts-ignore
                price += item.price;
            }
        }
        // if (this.invoice && this.invoice.items.length) {
        //     for (let item of this.invoice.items) {
        //         //@ts-ignore
        //         price += item.price;
        //     }
        // }
        return price;
    }

    get priceDiscount() {
        if (this.invoice?.payment?.discount?.value) {
            return this.invoice.payment.discount.value;
        }
        return 0;
    }
    get priceShipping() {
        if (this.invoice?.payment?.shipping?.value) {
            return this.invoice.payment.shipping.value;
        }
        return 0;
    }
    get priceTax() {
        if (this.invoice?.payment?.tax?.value) {
            return this.invoice.payment.tax.value;
        }
        return 0;
    }
    get totalPrice() {
        return (
            this.priceSubTotal -
            this.priceDiscount +
            this.priceShipping +
            this.priceTax
        );
    }

    getImage() {
        return `${window.location.origin}/${this.company.image}`;
    }
}
</script>

<style scoped>
.bgLogoPrevew {
    background: #ffffff;
    border-radius: 4px;
}
.bg-preview {
    /* background-color: #3c5cae; */
}
.mt-05 {
    margin-top: 2px;
}
.bgTr {
    background: rgba(236, 239, 247, 0.5);
}
</style>
