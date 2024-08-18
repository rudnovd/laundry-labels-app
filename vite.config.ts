import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'
import { URL, fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'

const pwaOptions: Partial<VitePWAOptions> = {
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  manifest: {
    name: 'Laundry Labels App',
    short_name: 'Laundry Labels',
    description: 'Save data on how to take care of your clothes',
    orientation: 'portrait-primary',
    theme_color: '#7cc6ff',
    background_color: '#7cc6ff',
    id: '/',
    icons: [
      {
        src: 'favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['lifestyle', 'productivity', 'utilities'],
  },
  includeAssets: ['robots.txt', 'sitemap.txt'],
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    define: {
      'import.meta.env.__APP_VERSION__': JSON.stringify(env.npm_package_version),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/quasar-variables";
          `,
        },
      },
    },
    plugins: [
      vue({ template: { transformAssetUrls } }),
      quasar({ sassVariables: 'src/styles/quasar-variables.scss' }),
      VitePWA(pwaOptions),
      svgLoader({ svgo: false, defaultImport: 'component' }),
      VueI18nPlugin({ include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**') }),
    ],
    server: {
      port: 5801,
    },
  }
})
