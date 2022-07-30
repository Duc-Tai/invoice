<template>
    <v-app dark>
        <v-main>
            <div class="bg" style="width: 100%">
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
export default class Default extends Vue {}
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
