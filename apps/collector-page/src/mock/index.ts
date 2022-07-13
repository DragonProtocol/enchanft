/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 14:37:50
 * @Description: mock 请求拦截入口
 */

import { ProjectStatus, RoadmapStatus, TaskStatus, TaskType } from '../types/api'
import Mock from 'mockjs'
const task_type = [TaskType.WHITELIST_ORIENTED, TaskType.WHITELIST_LUCK_DRAW]
const task_status = [TaskStatus.CANDO, TaskStatus.CANNOT, TaskStatus.DONE]
const roadmap_status = [RoadmapStatus.DONE, RoadmapStatus.UNDO]
const project_status = [ProjectStatus.ACTIVE, ProjectStatus.LIVE, ProjectStatus.FUTURE]
const start_tinme = () => new Date().getTime() + Mock.Random.integer(0, 1000 * 60 * 60 * 24)
const end_time = () => new Date().getTime() + Mock.Random.integer(1000 * 60 * 60 * 24 * 2, 1000 * 60 * 60 * 24 * 10)
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

    // 设定响应时间
    Mock.setup({
      timeout: 3000,
    })
    // 任务推荐
    Mock.mock(/\/tasks\/recommendation/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          id: '@increment',
          name: '@title(1, 5)',
          'type|1': task_type,
          startTime: start_tinme,
          endTime: end_time,
          winnersNum: 100,
          'acceptedStatus|1': task_status,
          project: {
            id: '@increment',
            name: '@title(1, 5)',
            image: "@dataImage('360x360', 'Project Image')",
            'status|1': project_status,
          },
          'actions|10': [
            {
              id: '@increment',
              name: '@title(3, 15)',
            },
          ],
        },
      ],
    })
    // 接任务
    Mock.mock(/\/tasks\/(\d*)\/takers/, 'post', {
      code: 0,
      msg: 'success',
      data: 'take task mock data',
    })
    // 项目列表
    Mock.mock(/\/projects(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          id: '@increment',
          name: '@title(1, 5)',
          image: "@dataImage('260x200', 'Project Image')",
          'status|1': project_status,
          taskNum: 100,
          floorPrice: '3+1',
          injectedCoins: '',
          itemTotalNum: 9999,
          mintPrice: '3+1',
          mintStartTime: start_tinme,
          publicSaleTime: start_tinme,
          publicSalePrice: '@integer(1, 100)',
          communityId: '@increment',
          community: {
            id: '@increment',
            name: '@title(1, 5)',
            image: "@dataImage('160x160', 'Community Image')",
          },
          'tasks|10': [
            {
              'type|1': task_type,
              startTime: start_tinme,
              endTime: end_time,
            },
          ],
        },
      ],
    })
    // 社区详情
    Mock.mock(/\/communities\/(\d*)(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      data: {
        community: {
          id: '@increment',
          name: '@title(1, 5)',
          icon: "@dataImage('160x160', 'Community Image')",
          description: '@paragraph(10, 30)',
          communityFollowerNum: '@integer(1, 10000)',
        },
        'projects|6': [
          {
            id: '@increment',
            name: '@title(1, 5)',
            image: "@dataImage('260x200', 'Project Image')",
            description: '@paragraph(10, 30)',
            story: '@paragraph(20, 100)',
            'status|1': project_status,
            taskNum: 100,
            floorPrice: '3+1',
            injectedCoins: '@integer(1, 10)',
            itemTotalNum: 9999,
            mintPrice: '3+1',
            mintMaxToken: '@integer(1, 100)',
            'taskType|1': task_type,
            mintStartTime: start_tinme,
            publicSaleTime: start_tinme,
            publicSalePrice: '@integer(1, 100)',
            'teamMembers|10': [
              {
                id: '@increment',
                partner: '@title(1, 5)',
                role: 'CO-FOUNDER',
                avatar: "@dataImage('200x200', 'Tema Member Avatar')",
                description: '@paragraph(10, 50)',
                projectId: '@increment',
              },
            ],
            'roadmap|10': [
              {
                id: '@increment',
                description: '@title(5, 15)',
                'status|1': roadmap_status,
              },
            ],
            'tasks|10': [
              {
                id: '@increment',
                name: '@title(1, 5)',
                'type|1': task_type,
                'acceptedStatus|1': task_status,
                winnersNum: 100,
                startTime: start_tinme,
                endTime: end_time,
                'actions|10': [
                  {
                    id: '@increment',
                    name: '@title(3, 15)',
                  },
                ],
              },
            ],
            'whitelists|10': [
              {
                id: '@increment',
                mintPrice: '3+1',
                mintStartTime: start_tinme,
                mintMaxNum: '@integer(1, 100)',
                totalNum: '@integer(1, 100)',
                projectId: '@increment',
                taskId: '@increment',
              },
            ],
          },
        ],
      },
    })

    // 贡献值排名
    Mock.mock(/\/communities\/(\d*0)\/contribution-rank(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ranking: '@increment',
          avatar: "@dataImage('40x40', 'Avatar')",
          userName: '@title(1, 3)',
          pubkey: '@uuid',
          score: '@integer(1, 100)',
        },
      ],
    })
  }
})()
export {}
