const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean dist folder before each build
    // Optimize for web environments
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
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
                  browsers: ['> 1%', 'last 2 versions', 'ie >= 11']
                },
                modules: false, // Keep ES modules for better tree shaking
                useBuiltIns: 'usage',
                corejs: false, // Don't include polyfills
              }]
            ],
            compact: true, // Compact output
            minified: true, // Enable Babel minification
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
              // Enable CSS minification
              import: false,
              url: false,
              // Optimize CSS imports
              importLoaders: 0,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    // Enhanced minification options without chunk splitting
    minimize: true,
    usedExports: true, // Enable tree shaking
    sideEffects: false, // Allow aggressive tree shaking
    // Additional optimizations
    concatenateModules: true, // Module concatenation for smaller bundles
    flagIncludedChunks: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
  },
  plugins: [
    // Define NODE_ENV for better dead code elimination
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // Provide jQuery and _ globally to avoid multiple imports
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      _: 'underscore',
    }),
    // Ignore moment.js locales if any dependencies use it
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  resolve: {
    // Faster module resolution
    extensions: ['.js'],
    alias: {
      // Use production builds of libraries when available
      'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      // Use the regular underscore build
      'underscore': path.resolve(__dirname, 'node_modules/underscore/underscore-umd.js'),
    },
    // Reduce resolve attempts
    modules: ['node_modules'],
    mainFields: ['browser', 'module', 'main'],
  },
  performance: {
    // Increase the size limit since this is a story format bundle
    maxAssetSize: 300000, // 300KB
    maxEntrypointSize: 300000, // 300KB
    hints: 'warning',
  },
  // Disable source maps for smaller bundle size
  devtool: false,
  // Additional optimizations
  stats: {
    // Reduce build output verbosity
    modules: false,
    children: false,
  },
};