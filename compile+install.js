const fs = require('fs')
const sass = require('sass')
const inliner = require('@vgrid/sass-inline-svg')
const compileCSS = require('./compile.js')

const COMPILED = compileCSS()

const FIREFOX_DATA_DIR = process.env.APPDATA + '/Mozilla/Firefox/'
const FIREFOX_PROFILE = fs.readFileSync(FIREFOX_DATA_DIR + 'installs.ini', {
  encoding:'utf8',
  flag:'r'
}).match(/^Default=(?<profile>.+)$/mi)?.groups.profile
const FIREFOX_PROFILE_DIR = `${FIREFOX_DATA_DIR}${FIREFOX_PROFILE}`

console.debug('Firefox Profile Dir:', FIREFOX_PROFILE_DIR)
console.debug('CSS Compiled:', COMPILED)

// write to profile
if (FIREFOX_PROFILE && COMPILED) {
  fs.copyFileSync('dist/chrome/userChrome.css', `${FIREFOX_PROFILE_DIR}/chrome/userChrome.css`)
  fs.copyFileSync('dist/chrome/userContent.css', `${FIREFOX_PROFILE_DIR}/chrome/userContent.css`)
  fs.copyFileSync('dist/user.js', `${FIREFOX_PROFILE_DIR}/user.js`)
}
