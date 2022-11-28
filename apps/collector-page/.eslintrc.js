/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-25 21:04:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 19:33:52
 * @Description: file description
 */
module.exports = {
  extends: ['../../.eslintrc'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.app.json', './tsconfig.spec.json'],
  },
  ignorePatterns: ['.eslintrc.js', 'craco.config.js', 'src/setupTests.ts'],
  rules: {
    'jsx-a11y/alt-text': 'off',
  },
};
