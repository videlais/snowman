const path = require('node:path');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: './src/twine-extensions/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'twine-extensions.bundle.js',
    library: {
      type: 'umd',
      name: 'SnowmanExtensions'
    },
    globalObject: 'this'
  },
  resolve: {
    fallback: {
      path: false,
      fs: false
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        type: 'asset/source'
      }
    ]
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'src/twine-extensions')
    },
    port: 3001,
    open: true
  }
};