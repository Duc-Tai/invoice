import { head } from 'lodash'
import colors from 'vuetify/es5/util/colors'

export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s - Market',
        title: 'Invoice',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        // /images/logo-zproxy.png
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '' },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Lato:400,700'
            }
        ],
    },
    ssr: false,
    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/css/main.css',
        '@/assets/css/toastr.css',
        '@fortawesome/fontawesome-free/css/all.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        'plugins/i18n.client',
        "~plugins/notify.client",
        "~plugins/fetchApi",
        "~plugins/repository",
        '~/plugins/localforage.client',
        '~/plugins/nuxt-client-init.client',
        '~/plugins/scroll.client',
        "~plugins/ultils",
        "~plugins/axios-accessor",
        "~plugins/vue-debounce",
        { src: '~/plugins/axios', ssr: false },

    ],
    // Auto import components: https://go.nuxtjs.dev/config-components
    components: false,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
        '@nuxtjs/localforage'

    ],
    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        'nuxt-clipboard2',
        // '@nuxtjs/firebase',
        // '@nuxtjs/recaptcha'
    ],
    // publicRuntimeConfig: {
    //     recaptcha: {
    //         hideBadge: true,
    //         siteKey: "6LeivdIaAAAAAIHkExAVASWxoa51yn2MDhV8TQRV",
    //         version: 2,
    //     },
    // },
    // firebase: {
    //     config: {
    //         apiKey: "AIzaSyCh845rN0bjSZMcnvyiNOW43c6ubzdGLA0",
    //         authDomain: "mmo-market-place.firebaseapp.com",
    //         databaseURL: "https://mmo-market-place-default-rtdb.firebaseio.com",
    //         projectId: "mmo-market-place",
    //         storageBucket: "mmo-market-place.appspot.com",
    //         messagingSenderId: "1091945248915",
    //         appId: "1:1091945248915:web:6f36a9bf060a8cfc9b3566",
    //         measurementId: "G-F2SPWXPTP2"
    //     },
    //     services: {
    //         database: true,
    //     }
    // },
    // publicRuntimeConfig: {
    //     recaptcha: {
    //         /* reCAPTCHA options */
    //         siteKey: "6LeivdIaAAAAAIHkExAVASWxoa5" // for example
    //     }
    // },
    server: {
        port: 7001
    },
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: 'http://localhost:7000',
        // baseURL: 'http://192.168.1.154:7000'
        // baseURL: 'https://api.zproxy.me'
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            options: {
                customProperties: true,
            },
            dark: false,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken2,
                    secondary: colors.amber.darken3,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                },
                light: {
                    primary: colors.blue,
                    secondary: "#f5f5f5",
                    background: "#f5f5f5"
                }
            }
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extractCSS: true,
        splitChunks: {
            layouts: false,
            pages: true,
            commons: true
        },
        postcss: false
    },

    watch: ['~/@types/*.ts']
}