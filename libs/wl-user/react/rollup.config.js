/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-23 16:40:30
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 16:43:47
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
import analyze from 'rollup-plugin-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];
export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    inlineDynamicImports: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'styled-components': 'styled',
      '@emotion/react': 'emotionReact',
      '@emotion/styled': 'emotionStyled',
    },
  },
  // 外部模块不再进行打包编译（通过packages中的包名为依据，代码中以指定名称或指定名称开头的包都算外部已经打包好的包）
  external: (id) =>
    externalPackages.some((name) => id === name || id.startsWith(`${name}/`)),
  plugins: [
    // 将commonjs模块转换为es模块
    commonjs(),
    // 配合babel对结果块文件执行代码转换
    babel(),
    // 将引用的图像文件进行 base64 编码
    image(),
    // 将 .json 文件转换为 ES6 模块
    json(),
    // 将引用的文件导入为数据 URI 或 ES 模块
    url(),
    // 不打包对等依赖项
    peerDepsExternal({
      packageJsonPath: './package.json',
    }),
    // 允许import css文件
    postcss(),
    // 调整svg文件的打包规则
    svgr({
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
    // 打包前通过eslint进行验证查看一下（配置.eslintrc）
    eslint({
      include: ['**/*.ts', '**/*.tsx'],
    }),
    // 配合typescript进行打包
    typescript({
      check: true,
      tsconfig: './tsconfig.lib.json',
      tsconfigOverride: {
        compilerOptions: {
          rootDir: './src',
          allowJs: false,
          declaration: true,
        },
      },
    }),
    // 教 Rollup 如何查找外部模块 (node_modules 中的包)
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    // 压缩混淆代码
    // terser(),
    // 拷贝静态文件到打包目录中
    copy({
      targets: [
        { src: './package.json', dest: 'dist' },
        { src: './README.md', dest: 'dist' },
      ],
    }),
    analyze({
      hideDeps: true,
      summaryOnly: true,
    }),
    process.argv.includes('--report')
      ? visualizer({
          filename: '.rollup-stats.html',
          gzipSize: true,
          brotliSize: true,
          open: true,
        })
      : null,
  ],
};
