/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-04 11:59:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 15:22:14
 * @Description: 覆盖 cra 内部 webpack 配置
 */

const path = require('path')
const webpack = require('webpack')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')

module.exports = {
  webpack: {
    configure: (config) => {
      // Remove guard against importing modules outside of `src`.
      // Needed for workspace projects.
      config.resolve.plugins = config.resolve.plugins.filter((plugin) => !(plugin instanceof ModuleScopePlugin))
      // Add support for importing workspace projects.
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          mainFields: ['module', 'main'],
        }),
      )

      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules[1].oneOf.forEach((r) => {
        if (r.loader && r.loader.indexOf('babel') !== -1) {
          r.exclude = /node_modules/
          delete r.include
        }
      })
      config.resolve.fallback = {
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
      }
      config.resolve.alias = {
        '@mui/styled-engine': '@mui/styled-engine-sc',
      }
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      )

      config.ignoreWarnings = [/Failed to parse source map/]
      return config
    },
  },
  jest: {
    configure: (config) => {
      config.resolver = '@nrwl/jest/plugins/resolver'
      return config
    },
  },
  devServer: {
    proxy: {
      '/': {
        target: 'https://test-enchanft-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
}
