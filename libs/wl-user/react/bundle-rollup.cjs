/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-20 16:37:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-04 16:13:59
 * @Description: file description
 */
const url = require('@rollup/plugin-url');
const svgr = require('@svgr/rollup');

module.exports = (options) => ({
  ...options,
  plugins: [
    ...options.plugins,
    url(),
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
  ],
});
