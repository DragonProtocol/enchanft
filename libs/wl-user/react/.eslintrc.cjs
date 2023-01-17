/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-25 02:24:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 15:17:38
 * @Description: file description
 */
module.exports = {
  extends: ['../../../.eslintrc'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['.eslintrc.cjs', 'rollup.config.js'],
};
