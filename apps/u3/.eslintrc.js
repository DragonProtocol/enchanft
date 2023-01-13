/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-25 21:04:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-14 23:45:21
 * @Description: file description
 */
module.exports = {
  extends: ['../../.eslintrc'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.app.json', './tsconfig.spec.json'],
  },
  ignorePatterns: ['.eslintrc.js', 'craco.config.js'],
  overrides: [
    {
      files: ['src/setupTests.ts'],
      rules: {
        // 允许某些文件导入的包在非dependencies中
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
