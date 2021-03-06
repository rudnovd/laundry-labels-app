import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  manifest: {
    name: 'Laundry Labels App',
    short_name: 'Laundry Labels',
    description: 'Store washing data for your clothes',
    orientation: 'portrait',
    theme_color: '#ffffff',
    start_url: '/',
    id: '/',
    icons: [
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
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
      vue({
        template: { transformAssetUrls },
      }),
      quasar({
        sassVariables: 'src/styles/quasar-variables.scss',
      }),
      VitePWA(pwaOptions),
    ],

    server: {
      proxy: {
        '^/api/.*': {
          target: `${env.VITE_APP_API_URL}:${env.VITE_APP_API_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '^/upload/.*': {
          target: `${env.VITE_APP_API_URL}:${env.VITE_APP_API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  }
})
