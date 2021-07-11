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
