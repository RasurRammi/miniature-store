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
    vendureAdminUrl: process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3001/admin-api',
    public: {
      adminApiUrl: '/api/admin',
    },
  },
  routeRules: {
    '/admin/**': { ssr: false },
    '/api/admin/**': { proxy: { to: `${process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3001/admin-api'}/**` } },
  },
  devServer: { host: '0.0.0.0' },
  compatibilityDate: '2025-01-15',
  vite: {
    server: { hmr: { host: 'localhost' } },
  },
})
