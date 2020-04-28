// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
require('dotenv').config()
module.exports = {
  siteName: 'Gridsome',
  chainWebpack: config => {
    config
      .plugin('env')
      .use(require.resolve('webpack/lib/EnvironmentPlugin'), ['VUE_APP_FAUNA_SECRET'])
  },
  plugins: [
    {
      use: 'gridsome-plugin-tailwind',
        options: {
          config: './tailwind.config.js'
        }
    }
    // {
    //   use: '@gridsome/source-plugin',
    //   options: {
    //     faunadb: process.env.VUE_APP_FAUNA_SECRET,
    //   }
    // }
  ]
}
