const fs = require('fs')
const sass = require('sass')
const inliner = require('@vgrid/sass-inline-svg')

function compileCSS () {
  try {
    // scss to css
    const { css } = sass.renderSync({
      file: 'src/userChrome.scss',
      outputStyle: 'expanded',
      sourceMap: false,
      omitSourceMapUrl: true,
      functions: {
        'inline-svg($path, $selectors: null)': inliner('./src/')
      }
    })

    // make some changes to transpiled css output
    const transformCSS = css => {
      const replacements = [
        // Firefox ? to 136
        [/\(-moz-bool-pref: (.+?)\)/g, '(-moz-bool-pref: "$1")'],
        // Firefox 137+
        [/\(-moz-bool-pref: (".+?")\)/g, '-moz-pref($1)'],
      ]

      for (const r of replacements ) {
        css = css.replace(r[0], r[1])
      }

      return css
    }

    // Write to dist
    fs.writeFileSync('dist/chrome/userChrome.css', transformCSS(css.toString()))
    fs.copyFileSync('src/userContent.css', 'dist/chrome/userContent.css')
    fs.copyFileSync('src/user.js', 'dist/user.js')

    return true
  } catch (err) {
    console.error(err)

    return false
  }
}

// if called directly not as required module
if (require.main === module) compileCSS()

module.exports = compileCSS
