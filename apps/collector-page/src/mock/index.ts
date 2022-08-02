/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 13:08:11
 * @Description: mock 请求拦截入口
 */

import {
  ActionType,
  ProjectStatus,
  RoadmapStatus,
  TaskAcceptedStatus,
  TaskTodoCompleteStatus,
  TaskType,
  UserActionStatus,
} from '../types/api'
import Mock from 'mockjs'
import { ChainIds } from '../utils/chain'
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

    const task_type = [TaskType.WHITELIST_ORIENTED, TaskType.WHITELIST_LUCK_DRAW]
    const task_accepted_status = [TaskAcceptedStatus.CANDO, TaskAcceptedStatus.CANNOT, TaskAcceptedStatus.DONE]
    const task_todo_status = [
      TaskTodoCompleteStatus.TODO,
      TaskTodoCompleteStatus.IN_PRGRESS,
      TaskTodoCompleteStatus.COMPLETED,
      TaskTodoCompleteStatus.WON,
      TaskTodoCompleteStatus.LOST,
      TaskTodoCompleteStatus.CLOSED,
    ]
    const roadmap_status = [RoadmapStatus.DONE, RoadmapStatus.UNDO]
    const project_status = [ProjectStatus.ACTIVE, ProjectStatus.LIVE, ProjectStatus.FUTURE]
    const project_chainid = [ChainIds.eth, ChainIds.solana]
    const action_type = [
      ActionType.FOLLOW_TWITTER,
      ActionType.INVITE_PEOPLE,
      ActionType.JOIN_DISCORD,
      ActionType.RETWEET,
      ActionType.LIKE_TWEET,
      ActionType.UPDATE_BIO_OF_TWITTER,
      ActionType.MEET_CONTRIBUTION_SCORE,
      ActionType.TURN_ON_NOTIFICATION,
    ]
    const user_action_status = [UserActionStatus.TODO, UserActionStatus.DONE]
    const start_tinme = () => new Date().getTime() + Mock.Random.integer(0, 1000 * 60 * 60 * 24)
    const range_tinme = () => new Date().getTime() + Mock.Random.integer(-1000 * 60 * 60 * 24, 1000 * 60 * 60 * 24)
    const end_time = () => new Date().getTime() + Mock.Random.integer(1000 * 60 * 60 * 24 * 2, 1000 * 60 * 60 * 24 * 10)

    const rich_text = `demodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemodemo`
    const projectEntity = () => {
      return {
        id: '@increment',
        slug: 'slug',
        name: '@title(1, 5)',
        image: "@dataImage('260x200', 'Project Image')",
        description: rich_text,
        'chainId|1': project_chainid,
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
        story: rich_text,
        mintMaxToken: '@integer(1, 100)',
        'taskType|1': task_type,
        community: {
          id: '@increment',
          name: '@title(1, 5)',
          image: "@dataImage('160x160', 'Community Image')",
          twitter: 'https://twitter.com/',
          discord: 'https://twitter.com/',
          website: 'https://twitter.com/',
        },
        'tasks|10': [
          {
            id: '@increment',
            name: '@title(1, 5)',
            'type|1': task_type,
            'acceptedStatus|1': task_accepted_status,
            winnerNum: 100,
            startTime: start_tinme,
            endTime: end_time,
            'actions|10': [
              {
                id: '@increment',
                name: '@title(3, 15)',
                description: rich_text,
                orderNum: Mock.Random.integer(1, 100),
                'type|1': action_type,
                taskId: '@increment',
                projectId: '@increment',
                communityId: '@increment',
                data: {
                  url: 'https://twitter.com/',
                },
                'status|1': user_action_status,
                progress: '',
              },
            ],
          },
        ],
        'teamMembers|10': [
          {
            id: '@increment',
            partner: '@title(1, 5)',
            role: 'CO-FOUNDER',
            avatar: "@dataImage('200x200', 'Tema Member Avatar')",
            description: rich_text,
            projectId: '@increment',
          },
        ],
        'roadmap|10': [
          {
            id: '@increment',
            description: rich_text,
            'status|1': roadmap_status,
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
      }
    }
    const taskEntity = () => {
      return {
        id: '@increment',
        name: '@title(1, 5)',
        image: "@dataImage('820x460', 'Task Image')",
        description: rich_text,
        'type|1': task_type,
        startTime: start_tinme,
        endTime: end_time,
        winnerNum: 100,
        mintUrl: 'https://www.baidu.com/',
        mintStartTime: range_tinme(),
        projectImage: Mock.Random.dataImage('40x40', 'project img'),
        'status|1': task_todo_status,
        whitelistTotalNum: Mock.Random.integer(1, 100),
        projectId: '@increment',
        'acceptedStatus|1': task_accepted_status,

        project: {
          slug: 'slug',
          id: '@increment',
          name: '@title(1, 5)',
          image: "@dataImage('360x360', 'Project Image')",
          'status|1': project_status,
          'chainId|1': project_chainid,
        },

        'actions|10': [
          {
            id: '@increment',
            name: '@title(3, 15)',
            description: rich_text,
            orderNum: Mock.Random.integer(1, 100),
            'type|1': action_type,
            taskId: '@increment',
            projectId: '@increment',
            communityId: '@increment',
            data: {
              url: 'https://twitter.com/',
            },
            'status|1': user_action_status,
            progress: '',
          },
        ],
        'winnerList|10': [
          // {
          //   id: '@increment',
          //   name: '@title(1, 3)',
          //   pubkey: '@uuid',
          //   avatar: "@dataImage('100x100', 'avatar')",
          // },
        ],
        whitelist: {
          id: '@increment',
          mintUrl: 'https://www.baidu.com/',
          mintPrice: '3+1 SOL',
          mintStartTime: range_tinme(),
          endTime: end_time,
          mintMaxNum: 10,
          totalNum: 100,
          projectId: '@increment',
          taskId: '@increment',
        },
      }
    }
    const whitelistEntity = () => {
      return {
        id: '@increment',
        mintUrl: 'https://www.baidu.com/',
        mintPrice: '3+1 SOL',
        mintStartTime: range_tinme(),
        endTime: end_time,
        mintMaxNum: 10,
        totalNum: 100,
        projectId: '@increment',
        taskId: '@increment',
        project: {
          id: '@increment',
          slug: 'slug',
          name: '@title(1, 5)',
          image: "@dataImage('260x200', 'Project Image')",
          description: rich_text,
          'chainId|1': project_chainid,
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
          story: rich_text,
          mintMaxToken: '@integer(1, 100)',
          'taskType|1': task_type,
        },
        community: {
          id: '@increment',
          name: '@title(1, 5)',
          icon: "@dataImage('160x160', 'Community Image')",
          twitter: 'https://twitter.com/',
          discord: 'https://twitter.com/',
          website: 'https://twitter.com/',
          project: {
            slug: 'slug',
          },
        },
      }
    }
    const communityEntity = () => {
      return {
        id: '@increment',
        name: '@title(1, 5)',
        icon: "@dataImage('160x160', 'Community Image')",
        twitter: 'https://twitter.com/',
        discord: 'https://twitter.com/',
        website: 'https://twitter.com/',
        project: {
          slug: 'slug',
        },
      }
    }
    // 设定响应时间
    Mock.setup({
      timeout: 1000,
    })

    // explore remmound tasks
    Mock.mock(/\/tasks\/recommendation/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ...taskEntity(),
        },
      ],
    })
    // explore search tasks
    Mock.mock(/\/tasks\/searching(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ...taskEntity(),
        },
      ],
    })
    // 用户的任务列表
    Mock.mock(/\/tasks\/todo/, 'get', {
      code: 0,
      msg: 'success',
      'data|30': [
        {
          ...taskEntity(),
        },
      ],
    })

    // 接任务
    Mock.mock(/\/tasks\/(\d*)\/takers/, 'post', {
      code: 0,
      msg: 'success',
      data: 'take task mock data',
    })

    // task detail
    Mock.mock(/\/tasks\/(\d*)/, 'get', {
      code: 0,
      msg: 'success',
      'data|': {
        ...taskEntity(),
      },
    })
    // project detail
    Mock.mock(/\/slug(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|': {
        ...projectEntity(),
      },
    })
    // explore recommend projects
    Mock.mock(/\/projects\/recommendation/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ...projectEntity(),
        },
      ],
    })
    // explore search projects
    Mock.mock(/\/projects(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ...projectEntity(),
        },
      ],
    })

    // 贡献值排名
    Mock.mock(/\/communities\/(\d*)\/contribution-rank(\\?.*|)/, 'get', {
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
    // user withlist
    Mock.mock(/\/users\/whitelists(\\?.*|)/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ...whitelistEntity(),
        },
      ],
    })
    // user /communities/followed
    Mock.mock(/\/communities\/followed/, 'get', {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          ...communityEntity(),
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
          description: rich_text,
          communityFollowerNum: '@integer(1, 10000)',
        },
        'projects|6': [
          {
            ...projectEntity(),
          },
        ],
      },
    })
  }
})()
export {}
