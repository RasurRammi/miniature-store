export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['@miniature-store/shared']
  },

  runtimeConfig: {
    vendureAdminUrl: process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3099/admin-api',
    public: {
      adminApiUrl: '/api/admin',
      storefrontUrl: process.env.STOREFRONT_URL ?? 'http://localhost:3000',
    },
  },
  routeRules: {
    '*': { ssr: false },
    '/api/admin/**': { proxy: { to: `${process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3099/admin-api'}/**` } },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3001
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
