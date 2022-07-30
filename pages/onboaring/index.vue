<template>
    <div class="d-flex align-center" style="height: 100%">
        <div style="width: 100%">
            <div>
                <v-card
                    class="elevation-0 px-9 py-8"
                    style="border-radius: 20px"
                    color="#FFFFFF"
                >
                    <div class="d-flex justify-center">
                        <img
                            v-if="!url"
                            src="~/assets/images/invoice-manager.png"
                            alt=""
                            width="296.43px"
                            height="239.99"
                        />
                        <img
                            style="border-radius: 8px"
                            :src="url"
                            alt=""
                            v-else
                            width="240px"
                            height="240px"
                        />
                    </div>
                    <div class="mt-6">
                        <p class="mb-0 fsize-22 contentMain text-center">
                            Set up your company:
                        </p>
                        <div class="my-3" id="hideBottomInput">
                            <v-text-field
                                :disabled="loading"
                                class="border-textfield"
                                v-model="companyName"
                                placeholder="Enter Company Name"
                                dense
                                outlined
                                background-color="#FFFFFF"
                            ></v-text-field>
                        </div>
                        <div class="mb-3">
                            <v-btn
                                :disabled="loading"
                                outlined
                                color="#3C5CAE"
                                block
                                @click="onSelectImage()"
                            >
                                <div class="d-flex align-center">
                                    <v-icon size="21" color="#3C5CAE">
                                        far fa-image
                                    </v-icon>
                                    <p
                                        class="ml-2 mb-0 bgBrand font-weight-bold"
                                    >
                                        Upload image
                                    </p>
                                </div>
                            </v-btn>

                            <div class="d-none">
                                <v-file-input
                                    v-model="image"
                                    ref="selectImage"
                                    accept="image/*"
                                    label="File input"
                                    @change="onChangeImage()"
                                ></v-file-input>
                            </div>
                        </div>
                        <div>
                            <v-btn
                                :disabled="loading"
                                color="#3C5CAE"
                                block
                                class="elevation-0"
                                @click="onConfirm()"
                                ><v-progress-circular
                                    v-if="loading"
                                    size="18"
                                    indeterminate
                                    color="#fff"
                                >
                                </v-progress-circular>
                                <p
                                    class="mb-0 white--text font-weight-bold"
                                    v-else
                                >
                                    Confirm
                                </p>
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import LangStore from "~/store/language";
import { getModule, Watch } from "nuxt-property-decorator";
import { Component, Vue } from "nuxt-property-decorator";
import { $localForage } from "~/plugins/localforage.client";
import { companyKey } from "~/common/constaint";
import axios from "axios";
import { updateImage } from "@/common/ultils/image";
import { reject, update } from "lodash";
@Component({
    middleware: "authenticated-home",
    components: {},
})
export default class Onboaring extends Vue {
    language = getModule(LangStore, this.$store);
    image: any = null;
    url = null;
    companyName = "";

    loading = false;

    async mounted() {
        const companyId: any = await $localForage.getItem(companyKey);
        if (companyId) {
            this.$router.push("/home");
        }
    }

    onSelectImage() {
        //@ts-ignore
        this.$refs.selectImage.$refs.input.click();
    }

    onChangeImage() {
        //@ts-ignore
        this.url = URL.createObjectURL(this.image);
        // this.image
    }

    async onConfirm() {
        try {
            if (!this.companyName) {
                return this.$notify("error", "Please enter company name");
            }
            if (!this.url) {
                return this.$notify("error", "Please select image");
            }
            this.loading = true;
            var data = new FormData();
            data.append("name", this.companyName);
            data.append("file", this.image);
            const response: any = await updateImage(
                "company/create",
                "post",
                data
            );
            if (response.data) {
                this.$notify("success", "Create a successful company");
                $localForage.setItem(companyKey, response.data._id);
                this.loading = false;
                this.$router.push("/home");
            }
        } catch (error) {
            this.loading = false;
            console.log("error :>> ", error);
        }
    }
}
</script>

<style>
body,
html {
    height: 100%;
    margin: 0;
}

.bg {
    background-image: url("~assets/images/loading.png");
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
