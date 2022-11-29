/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-25 21:04:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 13:37:09
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
  rules: {
    // 允许未在标签上添加alt属性
    'jsx-a11y/alt-text': 'off',
    // 关闭检查函数组件的定义方式
    'react/function-component-definition': 'off',
    // 关闭最后一个import后面需要添加空行的规则
    'import/newline-after-import': 'off',
  },
};
