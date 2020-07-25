// vue.config.js
module.exports = {
  // options...
  publicPath: "/desktop-search/",
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Bookmark Manager'
        return args
      })
  },
  pwa: {
    name: 'Bookmark Manager',
    appleMobileWebAppCapable: 'yes',
    manifestOptions: {
      "share_target": {
        "enctype": "application/x-www-form-urlencoded",
        "action": "/desktop-search/sharetarget",
        "method": "GET",
        "params": {
          "title": "title",
          "text": "text",
          "url": "url"
        }
      }
    }
  }

}