<template>
    <div></div>
</template>
<script lang="ts">
import LangStore from "~/store/language";
import { getModule, Watch } from "nuxt-property-decorator";

import { Component, Vue } from "nuxt-property-decorator";
@Component({
    middleware: "authenticated-home",
    components: {},
})
export default class Home extends Vue {
    mounted() {
        this.$router.push("/onboaring");
        // setTimeout(() => {
        //     this.$router.push('/')
        // }, 2000);
    }
}
</script>

<style></style>
