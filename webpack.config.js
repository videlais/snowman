const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    format: './src/index.js',
    editor: './src/editor/index.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].bundle.js'
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate vendor libraries (jQuery, etc.)
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20
        },
        // Separate optional/advanced features
        features: {
          test: /[\\/]src[\\/](Storylets|MingoQuisConverter)\.js$/,
          name: 'features', 
          chunks: 'all',
          priority: 15,
          minSize: 0
        },
        // Default group for remaining modules  
        default: {
          name: 'core',
          chunks: 'all',
          priority: 10,
          minChunks: 1
        }
      }
    }
  },
  plugins: [new MiniCssExtractPlugin()]
};
