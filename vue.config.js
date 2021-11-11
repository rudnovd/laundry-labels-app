// eslint-disable-next-line @typescript-eslint/no-var-requires
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
    loaderOptions: {
      // @use "sass:color";
      sass: {
        additionalData: `
          @import "~@/styles/quasar.variables.scss";
        `,
      },
    },
  },
  devServer: {
    proxy: {
      '^/api': {
        target: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      },
      '^/upload': {
        target: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      },
      '^/auth': {
        target: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      },
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },
  transpileDependencies: ['quasar'],
  pwa: {
    name: 'Laundry Labels App',
    themeColor: '#9ccc65',
    msTileColor: '#9ccc65',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      display: 'standalone',
      author: 'https://github.com/rudnovd',
      developer: {
        name: 'rudnovd',
        url: 'https://github.com/rudnovd',
      },
      start_url: '/',
      manifest_version: 2,
      version: '0.0',
      background_color: '#9ccc65',
      icons: [
        { src: 'favicon-192.png', type: 'image/png', sizes: '192x192' },
        { src: 'favicon-512.png', type: 'image/png', sizes: '512x512' },
      ],
    },

    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
    },
  },
}
