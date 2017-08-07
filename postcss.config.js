var autoprefixer = require('autoprefixer')
var cssnext = require('cssnext')
var precss = require('precss')

module.exports = {
  plugins: [
    autoprefixer({
        browsers: ["IE > 9", "Opera > 11", "Firefox > 14", "safari > 5", "Chrome > 30"]
    }),
    cssnext,
    precss
  ]
}