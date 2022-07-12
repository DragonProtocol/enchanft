/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-06 15:38:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 14:42:28
 * @Description: file description
 */
import { fetchListForProjectUrl, fetchListForRecommendTasksUrl } from '../../services/api/dashboard'
import { ProjectStatus, TaskStatus, TaskType } from '../../types/api'
export default [
  {
    url: '/api/task/listForRecommendTasks',
    method: 'get',
    resp: {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          id: '@increment',
          name: '@title(3, 5)',
          'type|1': [TaskType.WHITELIST_ORIENTED, TaskType.WHITELIST_LUCK_DRAW],
          startTime: '@date(unix)',
          endTime: '@date(unix)',
          winnersNum: 100,
          'isAccepted|1': false,
          'acceptedStatus|1': [TaskStatus.CANDO, TaskStatus.CANNOT, TaskStatus.DONE],
          project: {
            id: '@increment',
            name: '@title(3, 5)',
            image: "@dataImage('360x360', 'Project Image')",
            actions: {
              id: '@increment',
              name: '@title(3, 5)',
            },
          },
        },
      ],
    },
  },
  {
    url: '/api/project/listForProject',
    method: 'get',
    resp: {
      code: 0,
      msg: 'success',
      'data|10': [
        {
          id: '@increment',
          name: '@title(3, 5)',
          image: "@dataImage('260x200', 'Project Image')",
          'status|1': [ProjectStatus.ACTIVE, ProjectStatus.LIVE, ProjectStatus.FUTURE],
          taskNum: 100,
          floorPrice: '3+1',
          injectedCoins: '',
          itemTotalNum: 9999,
          mintPrice: '3+1',
          mintStartTime: '@date(unix)',
          community: {
            id: '@increment',
            name: '@title(3, 5)',
            image: "@dataImage('160x160', 'Community Image')",
          },
          tasks: {
            type: [TaskType.WHITELIST_ORIENTED, TaskType.WHITELIST_LUCK_DRAW],
            startTime: '@date(unix)',
            endTime: '@date(unix)',
          },
        },
      ],
    },
  },
]
