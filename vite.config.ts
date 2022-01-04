import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

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
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    define: {
      'import.meta.env.__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
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
      VitePWA(pwaOptions),
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
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '^/upload/.*': {
          target: `${process.env.VITE_API_URL}:${process.env.VITE_API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  })
}
