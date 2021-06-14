module.exports = {
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
    loaderOptions: {
      // sass: {
      //   additionalData: `
      //     @use "sass:color";
      //     @import "~@/styles/variables";
      //   `,
      // },
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
}
