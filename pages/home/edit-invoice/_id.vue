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

    invoiceId = "";

    image = "";
    async mounted() {
        const { id } = this.$route.params;
        if (id) {
            this.invoiceId = id;
        }
        const companyId: any = await $localForage.getItem(companyKey);
        if (companyId) {
            this.companyId = companyId;
        }
        this.invoice.color = this.listColor[2];
        this.invoice.createDate = moment(new Date()).format("YYYY-MM-DD");

        this.getInvoice();
        this.getCompany();
    }

    async getInvoice() {
        try {
            const response = await this.$API.invoiceAPI.getInvoiceOne(
                this.invoiceId
            );
            if (response) {
                this.invoice = response.data;
                this.invoice.createDate = moment
                    //@ts-ignore
                    .unix(this.invoice.createDate)
                    .format("YYYY-MM-DD");
                if (this.invoice.dueDate) {
                    this.invoice.dueDate = moment
                        //@ts-ignore
                        .unix(this.invoice.dueDate)
                        .format("YYYY-MM-DD");
                }

                if (
                    this.invoice.payment.discount &&
                    this.invoice.payment.discount.value
                ) {
                    this.payment.discount = this.invoice.payment.discount.value;
                }
                if (
                    this.invoice.payment.shipping &&
                    this.invoice.payment.shipping.value
                ) {
                    this.payment.shipping = this.invoice.payment.shipping.value;
                }
                if (
                    this.invoice.payment.tax &&
                    this.invoice.payment.tax.value
                ) {
                    this.payment.tax = this.invoice.payment.tax.value;
                }
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
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
    async onUpdateInvoice() {
        try {
            let createDate,
                dueDate = null;
            if (
                //@ts-ignore
                isNaN(this.invoice.createDate) ||
                //@ts-ignore
                isNaN(this.invoice.dueDate)
            ) {
                createDate = moment(this.invoice.createDate).unix();

                dueDate = moment(this.invoice.dueDate).unix();
            }
            const response = await this.$API.invoiceAPI.updateInvoice(
                { ...this.invoice, createDate, dueDate },
                this.invoiceId
            );
            if (response) {
                this.invoice = response.data;
                this.invoice.createDate = this.formatDateUpdate(
                    //@ts-ignore
                    this.invoice.createDate
                );
                this.invoice.dueDate = this.formatDateUpdate(
                    //@ts-ignore
                    this.invoice.dueDate
                );
                console.log("this.invoice :>> ", this.invoice);
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    }
    formatDate(date: any) {
        if (!date) return null;
        if (!isNaN(date)) {
            date = moment.unix(date).format("YYYY-MM-DD");
            console.log("date :>> ", date);
        }
        const [year, month, day] = date.split("-");
        console.log("year :>> ", year);
        return `${day}/${month}/${year}`;
    }
    formatDateUpdate(milliseconds: number) {
        return moment.unix(milliseconds).format("YYYY-MM-DD");
    }
    closeDialogAddItem() {
        this.addItem = {
            itemName: "",
            price: 0,
            quantity: 0,
        };
        this.editItem = null;
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
        this.editItem = null;
        this.onUpdateInvoice();
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
        // this.$notify("success", "Delete item successfully");
        this.dialogAddItem = false;
        this.editItem = null;
        this.onUpdateInvoice();
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
        this.onUpdateInvoice();
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
        this.onUpdateInvoice();
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
    changePaid(type: string) {
        this.invoice.paymentStatus = type;
        this.onUpdateInvoice();
    }
    getImage() {
        //@ts-ignore
        return `${window.location.origin}/${this.company.image}`;
    }
    // @Watch("invoice.createDate")
    // changeValueCreateDate() {
    //     this.onUpdateInvoice();
    // }
    // @Watch("invoice.dueDate")
    // changeValueDueDate() {
    //     this.onUpdateInvoice();
    // }

    onSelectImageShare() {
        console.log(
            "this.$refs.selectImageShare.click() :>> ",
            //@ts-ignore
            this.$refs.selectImageShare.click()
        );
        //@ts-ignore
        // this.$refs.selectImageShare.click();
    }
    async onChangeImage(e: any) {
        const files = e.target.files;
        if (!files.length) return;
        //@ts-ignore
        if (navigator.canShare({ files })) {
            try {
                await navigator.share({
                    //@ts-ignore
                    files,
                    title: "Images",
                    text: "Beautiful images",
                });
            } catch (error) {
                console.log("error :>> ", error);
            }
        } else {
        }
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
