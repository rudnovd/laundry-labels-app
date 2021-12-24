import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  strategies: 'injectManifest',
  manifest: {
    name: 'Laundry Labels App',
    short_name: 'Laundry Labels',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
}

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    define: {
      __APP_VERSION__:
        process.env.NODE_ENV === 'development'
          ? JSON.stringify(process.env.npm_package_version)
          : process.env.npm_package_version,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/quasar.variables.scss";
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
      // VitePWA(pwaOptions),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    server: {
      proxy: {
        '^/api/.*': {
          target: `${process.env.VITE_API_URL}:${process.env.VITE_API_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, ''),
        },
        '^/upload/.*': {
          target: `${process.env.VITE_API_URL}:${process.env.VITE_API_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, ''),
        },
        '^/auth/.*': {
          target: `${process.env.VITE_API_URL}:${process.env.VITE_API_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fallback/, ''),
        },
      },
    },
  })
}
