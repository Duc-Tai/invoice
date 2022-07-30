<template>
    <v-app dark>
        <v-main>
            <div style="width: 100%; height: 100%">
                <nuxt />
            </div>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import LangStore from "~/store/language";
import { getModule, Watch } from "nuxt-property-decorator";
import { Component, Vue } from "nuxt-property-decorator";
@Component({
    middleware: "authenticated-home",
    components: {},
})
export default class CreateInvoice extends Vue {}
</script>

<style></style>
