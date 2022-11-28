/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 10:35:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 18:47:13
 * @Description: file description
 */
export default {
  displayName: 'collector-page',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/collector-page',
};
