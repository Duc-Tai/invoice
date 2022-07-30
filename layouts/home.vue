<template>
    <v-app> </v-app>
</template>

<script lang="ts">
import { Component, getModule, Vue, Watch } from "nuxt-property-decorator";
import LangStore from "~/store/language";
import { $localForage } from "~/plugins/localforage.client";
@Component({
    layout: "home",
    components: {},
})
export default class HomeLayout extends Vue {
    language = getModule(LangStore, this.$store);
}
</script>

<style></style>
