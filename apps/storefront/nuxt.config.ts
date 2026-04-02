export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'],
    },
  },
  runtimeConfig: {
    vendureShopUrl: process.env.VENDURE_SHOP_URL ?? 'http://localhost:3001/shop-api',
    public: {
      shopApiUrl: '/api/shop',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/api/shop/**': { proxy: { to: `${process.env.VENDURE_SHOP_URL ?? 'http://localhost:3001/shop-api'}/**` } },
  },
  devServer: { host: '0.0.0.0' },
  compatibilityDate: '2025-01-15',
  vite: {
    server: { hmr: { host: 'localhost' } },
  },
})
