/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-23 16:40:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-24 19:32:30
 * @Description: file description
 */
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import eslint from '@rollup/plugin-eslint';
import svgr from '@svgr/rollup';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import lodash from 'lodash'
// const packageJson = require("./package.json");
// const getNewPkgContent = () => lodash.pick(packageJson, ['name', 'version', 'devDependencies', 'dependencies', 'peerDependencies', 'module', 'type', 'types']).toString()
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: "esm",
    sourcemap: true,
    inlineDynamicImports: true
  },
  plugins: [
    // 将commonjs模块转换为es模块
    commonjs(),
    // 配合babel编译成低版本的代码（配置.babelrc）
    babel(),
    // 将引用的图像文件进行 base64 编码
    image(),
    // 将 .json 文件转换为 ES6 模块
    json(),
    // 教 Rollup 如何查找外部模块 (node_modules 中的包)
    resolve({
      preferBuiltins: true
    }),
    // 将引用的文件导入为数据 URI 或 ES 模块
    url(),
    // 不打包对等依赖项
    peerDepsExternal(),
    // 允许import css文件
    postcss(),
    // 调整svg文件的打包规则
    svgr({
      exportType: 'named',
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // 在默认预设中，禁用移除viewBox的插件
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
    // 打包前通过eslint进行验证（配置.eslintrc）
    eslint({
      include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    }),
    // 配合typescript进行打包
    typescript({ tsconfig: './tsconfig.lib.json' }),
    // 压缩打包后的体积
    terser(),
    // 拷贝一些静态文件到打包目录中
    copy({
      targets: [
        // {
        //   src: './package.json',
        //   dest: 'dist',
        //   // transform: (contents) => getNewPkgContent()
        // },
        { src: './README.md*', dest: 'dist' }
      ],

      hook: 'writeBundle'
    })
  ],
};
