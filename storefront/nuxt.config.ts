export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/ui'],
  devServer: {host: '0.0.0.0'},
  vite: {
    server: {hmr: {host: 'localhost'}}
  },
  devtools: {enabled: true},
  runtimeConfig: {
    vendureShopUrl: process.env.VENDURE_SHOP_URL ?? 'http://localhost:3001/shop-api',
    vendureAdminUrl: process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3001/admin-api',
    public: {
      shopApiUrl: '/api/shop',
      adminApiUrl: '/api/admin',
    }
  },
  routeRules: {
    '/': {prerender: true},
    '/api/shop/**': {proxy: {to: `${process.env.VENDURE_SHOP_URL ?? 'http://localhost:3001/shop-api'}/**`}},
    '/api/admin/**': {proxy: {to: `${process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3001/admin-api'}/**`}},
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-15',
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error']
    }
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
  }
})
