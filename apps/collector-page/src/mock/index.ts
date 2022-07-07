/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 20:46:06
 * @Description: mock 请求拦截入口
 */

import { ProjectStatus, TaskStatus, TaskType } from '../types/api'
import Mock from 'mockjs'
;(async () => {
  // 只在开发环境，且设定启动mock
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK === '1') {
    // const mockGroup = await import('./mocks')
    // const { default: Mock } = await import('mockjs')
    // for (const [key, mocks] of Object.entries(mockGroup)) {
    //   for (const mock of mocks.default as unknown as Array<any>) {
    //     const res = Mock.mock(mock.url, mock.method, mock.resp)
    //     console.log({
    //       url: mock.url,
    //       method: mock.method,
    //       resp: mock.resp,
    //       res,
    //     })
    //   }
    // }

    // TODO 上面的方式没有代理成功，这里先手动代理
    Mock.mock('/api/task/listForRecommendTasks', 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          id: '@increment',
          name: '@title(1, 5)',
          'type|1': [TaskType.WHITELIST_ORIENTED, TaskType.WHITELIST_LUCK_DRAW],
          startTime: '@date(unix)',
          endTime: '@date(unix)',
          winnersNum: 100,
          'isAccepted|1': false,
          'acceptedStatus|1': [TaskStatus.CANDO, TaskStatus.CANNOT, TaskStatus.DONE],
          project: {
            id: '@increment',
            name: '@title(1, 5)',
            image: "@dataImage('360x360', 'Project Image')",
            'status|1': [ProjectStatus.ACTIVE, ProjectStatus.LIVE, ProjectStatus.FUTURE],
          },
          'actions|10': [
            {
              id: '@increment',
              name: '@title(3, 5)',
            },
          ],
        },
      ],
    })
    Mock.mock(/\/api\/project\/listForProject(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          id: '@increment',
          name: '@title(1, 5)',
          image: "@dataImage('260x200', 'Project Image')",
          'status|1': [ProjectStatus.ACTIVE, ProjectStatus.LIVE, ProjectStatus.FUTURE],
          taskNum: 100,
          floorPrice: '3+1',
          injectedCoins: '',
          itemsNum: 9999,
          mintPrice: '3+1',
          mintStartTime: '@date(unix)',
          community: {
            id: '@increment',
            name: '@title(1, 5)',
            image: "@dataImage('160x160', 'Community Image')",
          },
          'tasks|10': [
            {
              type: [TaskType.WHITELIST_ORIENTED, TaskType.WHITELIST_LUCK_DRAW],
              startTime: '@date(unix)',
              endTime: '@date(unix)',
            },
          ],
        },
      ],
    })
  }
})()
export {}
