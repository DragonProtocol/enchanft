/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:28:51
 * @Description: mock 请求拦截入口
 */

;(async () => {
  // 只在开发环境，且设定启动mock
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK === '1') {
    // 登陆相关接口拦截
    const mockGroup = await import('./mocks')
    const { default: Mock } = await import('mockjs')
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, mocks] of Object.entries(mockGroup)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const mock of mocks as unknown as Array<any>) {
        Mock.mock(mock.url, mock.method, mock.resp)
      }
    }
  }
})()
export {}
