# react-mixin-transformer

[![npm version](https://badge.fury.io/js/react-mixin-transformer.svg)](http://badge.fury.io/js/react-mixin-transformer)

`react-mixin-transformer` is a transformer for use with `webpack` and
`esprima-loader`. It allows you to pass in an array of `mixins` that you want
to inject into all of your `React` `components.`

## TODO

- Write tests.

## Install

```
npm install esprima-loader --save-dev
npm install react-mixin-transformer --save-dev
```

## Usage

```javascript
ReactMixinTransformer.inject([array], boolean)
ReactMixinTransformer.inject(['ReactDebuggerMixin'], true)
```

- `[array]` - Array of Strings of the Mixins you want to inject.
- `boolean` - Boolean, of whether to display verbose logging during the transform process.


## Webpack Config Example

```javascript
// webpack.config.js
var webpack = require('webpack');
var path = require('path');
var ReactMixinTransformer = require('ReactMixinTransformer');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'esprima!react-hot!babel-loader?experimental&optional=runtime'
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      ReactDebuggerMixin: path.join(__dirname, './app/components/mixins/ReactDebuggerMixin')
    })
  ],

  esprima: {
    transforms: [
      ReactMixinTransformer.inject(['ReactDebuggerMixin'], false)
    ]
  }
}
```

## Notes

It is recommended you make the `mixins` that you want to inject available via
`webpack`'s `ProvidePlugin`.

## Resources

- [Esprima AST Explorer](http://felix-kling.de/esprima_ast_explorer/)
- [esprima-loader](https://www.npmjs.com/package/esprima-loader)
- [webpack plugins](http://webpack.github.io/docs/list-of-plugins.html#defineplugin)
- [React Conf 2015 - AST Transformations](https://www.youtube.com/watch?v=OZGgVxFxSIs)
- [estraverse](https://github.com/estools/estraverse)
- [component-flow-loader](https://github.com/gurdasnijor/component-flow-loader)
- [reactiflux](https://reactiflux.slack.com/) - Slack for React developers

## Special Thanks

- [@iamdustan](https://github.com/iamdustan), for `esprima-loader` and the pointers.
- [@gurdasnijor](https://github.com/gurdasnijor), for the great intro about `AST` transformations at React Conf.
