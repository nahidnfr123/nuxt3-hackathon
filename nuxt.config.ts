// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: './src/',
  ssr: true,
  typescript: {
    shim: false
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@formkit/nuxt',
    '@pinia/nuxt',
    'nuxt-icon'
  ],
  css: [
    // '~/assets/css/main.css',
    '~/assets/scss/main.scss',
    'awesome-notifications/dist/style.css',
  ],
  formkit: {
    defaultConfig: true,
    configFile: './src/config/formkit.config.js',
    // ^ this is now a full config replacement, not override.
  },
  // vue: {
  //   compilerOptions: {
  //     directiveTransforms: {
  //       motion: () => ({
  //         props: [],
  //         needRuntime: true
  //       })
  //     }
  //   }
  // },
  runtimeConfig: {
    public: {
      siteName: 'Hackathon',
      apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://36.255.69.12/api/'
    }
  }
})
