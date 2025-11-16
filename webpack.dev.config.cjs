const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './lib/index.js',
  output: {
    filename: 'main.dev.js',
    path: path.resolve(__dirname, 'dist'),
    clean: false, // Don't clean dist folder - keep production builds
    // Keep readable output for debugging
    environment: {
      arrowFunction: true,
      bigIntLiteral: false,
      const: true,
      destructuring: true,
      dynamicImport: false,
      forOf: true,
      module: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                },
                modules: false,
                useBuiltIns: 'usage',
                corejs: false,
              }]
            ],
            compact: false, // Keep readable output
            minified: false, // No minification
            comments: true, // Keep comments
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              import: false,
              url: false,
              importLoaders: 0,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false, // No minification
    usedExports: false, // Disable tree shaking for debugging
    sideEffects: false,
    concatenateModules: false, // Keep modules separate for debugging
    // Remove webpack module info comments to reduce size
    removeAvailableModules: true,
    removeEmptyChunks: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'underscore',
    }),
  ],
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
    mainFields: ['browser', 'module', 'main'],
  },
  // No source maps for smaller file size during testing
  // You can enable 'source-map' if you need to debug with browser devtools
  devtool: false,
  stats: {
    modules: true,
    children: true,
  },
};
