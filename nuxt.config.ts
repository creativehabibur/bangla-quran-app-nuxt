// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    telemetry: false,
    modules: ['@nuxtjs/tailwindcss'],
    app: {
        head: {
          title: 'Quran App by Nuxt',
          meta: [
            {name: 'description', content: 'Simple quran app by Nuxt 3 using Al Quran Cloud api'}
          ],
          link: [
            {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
            {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Hind+Siliguri&family=Noto+Naskh+Arabic&display=swap'},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'},
            {rel: 'icon', href: '/_nuxt/assets/images/nuxt-logo.png'}
          ]
        }
    }
})