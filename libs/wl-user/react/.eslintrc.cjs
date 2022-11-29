/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-25 02:24:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-27 22:47:38
 * @Description: file description
 */
module.exports = {
  "extends": ["../../../.eslintrc"],
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "project": ["./tsconfig.lib.json", "./tsconfig.spec.json"]
  },
  "ignorePatterns": [".eslintrc.cjs", "rollup.config.js"]
}
