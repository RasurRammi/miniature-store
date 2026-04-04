export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['@miniature-store/shared']
  },

  runtimeConfig: {
    vendureShopUrl: process.env.VENDURE_SHOP_URL ?? 'http://localhost:3099/shop-api',
    public: {
      shopApiUrl: '/api/shop',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/api/shop/**': { proxy: { to: `${process.env.VENDURE_SHOP_URL ?? 'http://localhost:3099/shop-api'}/**` } },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  compatibilityDate: '2025-01-15',
  vite: {
    resolve: {
      dedupe: ['vue', 'pinia', '#app', 'nuxt/app']
    },
    optimizeDeps: {
      include: ['@miniature-store/shared']
    },
    server: { hmr: { host: 'localhost' } },
  },
})
