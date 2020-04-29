const postcss = require('postcss')

const propReg = /^background(-image)?$/

module.exports = postcss.plugin(
  'postcss-webp',
  ({
    webpClass = 'webp',
    prefix = 'x-oss-process=image/format,webp',
    pattern = /\.(png|jpe?g)/,
    cssModules = false,
    ignoreComment = 'webp-ignore'
  } = {}) => {
    return (root) => {
      root.walkRules((rule) => {
        const ruleIgnore = rule.parent.nodes.filter((el) => el.type === 'comment' && el.text === ignoreComment)
        if (ruleIgnore.length) return
        if (rule.selector.indexOf(`.${webpClass}`) !== -1) return
        const hasBackground = rule.nodes.filter((el) => {
          return el.type === 'decl' && el.prop.match(propReg)
        })
        if (hasBackground) {
          const webpRule = postcss.rule({
            selector: cssModules ? `:global(.${webpClass}) ${rule.selector}` : `.${webpClass} ${rule.selector}`
          })
          rule.walkDecls(propReg, (decl, index) => {
            const declIgnore = decl.next() && decl.next().type === 'comment' && decl.next().text === ignoreComment
            if (declIgnore || !decl.value.match(pattern)) return
            const hasUrl = decl.value.match(/url\((.*)?\)/)
            if (hasUrl) {
              const imageUrl = hasUrl[1].replace(/'|"/gi, '')
              if (imageUrl.indexOf(prefix) !== -1) {
                return
              }
              const webpImageUrl = imageUrl.indexOf('?') === -1 ? imageUrl + '?' + prefix : imageUrl + '&' + prefix
              webpRule.append({
                prop: 'background-image',
                value: `url(${webpImageUrl})`
              })
            }
          })

          if (webpRule.nodes.length) {
            rule.after(webpRule)
          }
        }
      })
    }
  }
)
