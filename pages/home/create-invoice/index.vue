<template src="./template.html"></template>
<script lang="ts">
import LangStore from "~/store/language";
import { getModule, Watch } from "nuxt-property-decorator";
import { Component, Vue } from "nuxt-property-decorator";
import moment from "moment";
import { $localForage } from "~/plugins/localforage.client";
import { companyImageKey, companyKey } from "~/common/constaint";
@Component({
    middleware: "authenticated-home",
    components: {},
    layout: "createInvoice",
})
export default class CreateInvoice extends Vue {
    invoice = {
        invoiceNumber: "",
        invoiceName: "",
        createDate: "",
        dueDate: "",
        clientName: "",
        phoneNumber: "",
        items: [],
        color: "",
        paymentStatus: "overdue",
        payment: {
            subtotal: 0,
            discount: {
                discountType: "",
                value: 0,
            },
            shipping: {
                shippingType: "",
                value: 0,
            },
            tax: {
                taxType: "",
                value: 0,
            },
        },
    };
    menuCreateDate = false;
    menuDueDate = false;

    addItem = {
        itemName: "",
        price: 0,
        quantity: 0,
    };
    editItem = null;
    payment = {
        discount: 0,
        shipping: 0,
        tax: 0,
    };

    dialogAddItem = false;
    dialogEditPayment = false;
    sheetChooseColor = false;

    listColor = [
        "#2E251D",
        "#54585D",
        "#3C5CAE",
        "#79D7FF",
        "#FC6161",
        "#E8AC2B",
        "#3CAE69",
        "#884ECF",
    ];
    textTileEditPayment = "";
    activeButton = 1;

    valuePayment = 0;

    isPaid = "draft";
    isExclusive = true;
    amountBefore = 0;

    company = {};
    companyId = "";

    loading = false;
    async mounted() {
        const companyId: any = await $localForage.getItem(companyKey);
        if (companyId) {
            this.companyId = companyId;
        }
        this.invoice.color = this.listColor[2];
        this.invoice.createDate = moment(new Date()).format("YYYY-MM-DD");

        this.getCompany();
    }

    async getCompany() {
        try {
            const response = await this.$API.companyAPI.getCompany(
                this.companyId
            );
            if (response) {
                $localForage.setItem(companyKey, response.data._id);
                $localForage.setItem(companyImageKey, response.data.image);
                this.company = response.data;
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    }
    getImage() {
        //@ts-ignore
        return `${window.location.origin}/${this.company.image}`;
    }

    formatDate(date: string) {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    }
    closeDialogAddItem() {
        this.addItem = {
            itemName: "",
            price: 0,
            quantity: 0,
        };
        this.dialogAddItem = false;
    }
    onAddItem() {
        if (
            !(
                this.addItem.itemName ||
                this.addItem.price ||
                this.addItem.quantity
            )
        ) {
            return this.$notify("error", "Fields cannot be left blank");
        } else if (this.addItem.price < 1) {
            return this.$notify("error", "The price cannot be less than 0");
        } else if (this.addItem.quantity < 1) {
            return this.$notify("error", "The quantity cannot be less than 0");
        }
        //@ts-ignore
        this.invoice.items.push(this.addItem);
        this.addItem = {
            itemName: "",
            price: 0,
            quantity: 0,
        };
        this.$notify("success", "Added item successfully!");
        this.dialogAddItem = false;
    }
    idxItem = 0;
    openDialoEditItem(item: any, idx: number) {
        if (item) {
            this.idxItem = idx;
            this.editItem = item;
            this.dialogAddItem = true;
        }
    }
    onDelete() {
        this.invoice.items.splice(this.idxItem, 1);
        this.idxItem = 0;
        this.$notify("success", "Delete item successfully");
        this.dialogAddItem = false;
        this.editItem = null;
    }
    async onSaveInvoice() {
        try {
            // if(!(this.invoice.invoiceNumber || this.invoice.invoiceName || this.invoice.createDate || this.invoice.dueDate || this.invoice.clientName || this.invoice.phoneNumber || this.invoice.items.length || this.invoice.color || this.invoice.paymentStatus || )){

            // }
            const regexNumberPhone =
                /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
            //@ts-ignore
            if (
                this.invoice.phoneNumber &&
                !regexNumberPhone.test(this.invoice.phoneNumber)
            ) {
                return this.$notify(
                    "error",
                    "Please enter a valid phone number"
                );
            }
            const createDate = moment(this.invoice.createDate).unix();
            const dueDate = moment(this.invoice.dueDate).unix();
            const payload = {
                companyId: this.companyId,
                ...this.invoice,
                createDate,
                dueDate,
            };
            this.loading = true;
            const response = await this.$API.invoiceAPI.createInvoice(payload);
            console.log("response :>> ", response);
            if (response) {
                this.loading = false;
                this.$notify("success", "Create invoice successfully");
                this.$router.push("/home");
            }
        } catch (error) {
            this.loading = false;
            console.log("error :>> ", error);
        }
    }
    openDialogEditPayment(type: string) {
        if (type) {
            this.activeButton = 1;
            this.textTileEditPayment = type;
            this.dialogEditPayment = true;
        }
    }
    onConfirmPayment() {
        // (this.priceSubTotal / this.valuePayment * 100)

        if (this.textTileEditPayment === "discount") {
            this.setValueInvoicePayment("discount");
        }
        if (this.textTileEditPayment === "shipping") {
            this.setValueInvoicePayment("shipping");
        }
        if (this.textTileEditPayment === "tax") {
            this.setValueInvoicePayment("tax");
        }
        this.dialogEditPayment = false;
        this.valuePayment = 0;
    }

    setValueInvoicePayment(type: string) {
        console.log("this.invoice.payment :>> ", this.invoice.payment);
        console.log("type :>> ", type);
        if (this.activeButton === 1) {
            //@ts-ignore
            this.invoice.payment[type][`${type}Type`] = "noDiscount";
            //@ts-ignore
            this.invoice.payment[type].value = 0;
            //@ts-ignore
            this.payment[type] = 0;
        }
        if (this.activeButton === 2) {
            console.log("vào đây");
            //@ts-ignore
            this.payment[type] = (this.priceSubTotal * this.valuePayment) / 100;
            //@ts-ignore
            this.invoice.payment[type][`${type}Type`] = "percent";
            //@ts-ignore
            this.invoice.payment[type].value =
                (this.priceSubTotal * this.valuePayment) / 100;
        }
        if (this.activeButton === 3) {
            //@ts-ignore
            this.payment[type] = this.valuePayment;
            //@ts-ignore
            this.invoice.payment[type][`${type}Type`] = "flat";
            if (this.isExclusive) {
                //@ts-ignore
                this.invoice.payment[type].value = this.valuePayment; //Exclusive Tax
            } else {
                //@ts-ignore
                this.invoice.payment[type].value = 0; //Inclusive Tax
            }
        }
    }
    onChooseColor(color: string) {
        this.invoice.color = color;
        this.sheetChooseColor = false;
    }
    get computedCreateDateFormatted() {
        return this.formatDate(this.invoice.createDate);
    }

    get computedDueDateFormatted() {
        return this.formatDate(this.invoice.dueDate);
    }

    get priceSubTotal() {
        let price = 0;
        for (let item of this.invoice.items) {
            //@ts-ignore
            price += item.price;
        }
        return price;
    }

    get priceTotal() {
        let price = this.priceSubTotal;

        // if (this.payment.discount) {
        //     price -= this.payment.discount;
        // }
        // if (this.payment.shipping) {
        //     price += this.payment.shipping;
        // }
        // if (this.payment.tax) {
        //     price += this.payment.tax;
        // }
        if (price) {
            let priceReduce = 0;
            if (this.isExclusive) {
                priceReduce += this.payment.tax;
            }
            price =
                price -
                this.payment.discount +
                this.payment.shipping +
                priceReduce;
        }
        return price.toFixed(2);
    }

    get percentDiscount() {
        let percent: any = 0;
        if (this.payment.discount) {
            percent = parseFloat(
                //@ts-ignore
                (this.payment.discount / this.priceSubTotal) * 100
            ).toFixed(1);
        }
        return percent;
    }

    get percentShipping() {
        let percent: any = 0;
        if (this.payment.shipping) {
            percent = parseFloat(
                //@ts-ignore
                (this.payment.shipping / this.priceSubTotal) * 100
            ).toFixed(1);
        }
        return percent;
    }

    get percentTax() {
        let percent: any = 0;
        if (this.payment.tax) {
            percent = parseFloat(
                //@ts-ignore
                (this.payment.tax / this.priceSubTotal) * 100
            ).toFixed(1);
        }
        return percent;
    }
}
</script>

<style scoped>
.paymentButtonActive {
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
}
</style>
