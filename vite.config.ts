import type { VitePWAOptions } from 'vite-plugin-pwa'
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'
import VueRouter from 'vue-router/vite'
import packageJson from './package.json' with { type: 'json' }

const pwaOptions: Partial<VitePWAOptions> = {
  disable: !!process.env.VITE_IS_TAURI,
  registerType: 'autoUpdate',
  manifest: {
    name: 'Laundry Labels',
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

const commitSha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim()
const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({ dts: 'src/types/typed-router.d.ts' }),
    vue(),
    VitePWA(pwaOptions),
    svgLoader({ defaultImport: 'component' }),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_GIT_COMMIT_SHA': JSON.stringify(commitSha),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
  server: {
    port: 8140,
    strictPort: true,
    host: host || false,
    // ws: host
    //   ? {
    //       protocol: 'ws',
    //       host,
    //       port: 1421,
    //     }
    //   : false,
    watch: { ignored: ['**/src-tauri/**'] },
  },
  clearScreen: false, // prevent Vite from obscuring rust errors
})
