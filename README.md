# PostCSS Webp

[PostCSS] plugin for add webp prefix to css.

[postcss]: https://github.com/postcss/postcss

Before:

```css
.foo {
  background-image: url(./bg.png);
}
```

After:

```css
.foo {
  background-image: url(./bg.png);
}
.webp .foo {
  background-image: url(./bg.png?x-oss-process=image/format, webp);
}
```

## Requirements

Set webp class in your html. For example:

```js
var isSupportWebp =
  !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
if (isSupportWebp) {
  document.documentElement.classList.add('webp')
}
```

Add `[query]` to name of url-loader or file-loader options. For example:

```js
{
  test: /\.(png|jpe?g|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024 * 2,
        name: 'images/[name].[contenthash].[ext][query]'
      }
    }
  ]
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-webp'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

## Options

### webpClass

Type: `string` Default: `'webp'`

Class name of 1px border for retina devices

### prefix

Type: `string` Default: `'x-oss-process=image/format,webp'`

Prefix query for webp image, aliyun oss by default

### pattern

Type: `RegExp` Default: `/\.(png|jpe?g)/`

Transform rule for image url

### cssModules

Type: `boolean` Default: `false`

If you have [cssModules] enabled, set to true
[cssmodules]: https://github.com/webpack-contrib/css-loader#modules

### ignoreComment

Type: `string` Default: `'webp-ignore'`

Set comment to ignored

ignore whole rule

```css
/* webp-ignore */
.foo {
  background-image: url(./bg.png);
}
```

ignore single property

```css
.foo {
  background-image: url(./bg.png); /* webp-ignore */
}
```
