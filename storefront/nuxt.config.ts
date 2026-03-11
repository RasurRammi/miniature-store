export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error']
    }
  },
  runtimeConfig: {
    vendureShopUrl: process.env.VENDURE_SHOP_URL ?? 'http://localhost:3001/shop-api',
    vendureAdminUrl: process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3001/admin-api',
    public: {
      shopApiUrl: '/api/shop',
      adminApiUrl: '/api/admin'
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/api/shop/**': { proxy: { to: `${process.env.VENDURE_SHOP_URL ?? 'http://localhost:3001/shop-api'}/**` } },
    '/api/admin/**': { proxy: { to: `${process.env.VENDURE_ADMIN_URL ?? 'http://localhost:3001/admin-api'}/**` } }
  },
  devServer: { host: '0.0.0.0' },
  compatibilityDate: '2025-01-15',
  vite: {
    server: { hmr: { host: 'localhost' } }
  },
  eslint: {
    config: {
      stylistic: true
    }
  }
})
