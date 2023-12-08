// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { 
    enabled: true 
  },
  imports: {
    autoImport: true
  },
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],
  css: [
    '@unocss/reset/tailwind.css'
  ]
})
