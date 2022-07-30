<template>
    <v-app dark class="back">
        <div
            style="min-height: 100vh"
            class="d-flex justify-center align-center"
        >
            <div class="text-center">
                <h1 id="h1">404</h1>
                <h2 id="h2" class="mb-2">
                    Sorry, an error has occured, Requested Page not found!.
                </h2>
                <h6 id="h6">
                    You may have mistyped the address or the page may have
                    moved.
                </h6>
                <NuxtLink to="/auth/login" class="text-decoration-none">
                    <v-btn color="primary">Home page</v-btn>
                </NuxtLink>
            </div>
        </div>
    </v-app>
</template>

<script>
export default {
    layout: "empty",
    props: {
        error: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            pageNotFound: "404 Not Found",
            otherError: "An error occurred",
        };
    },
    head() {
        const title =
            this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        return {
            title,
        };
    },
};
</script>

<style scoped></style>
