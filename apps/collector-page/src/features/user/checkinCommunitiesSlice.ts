/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-29 14:40:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-29 19:32:36
 * @Description: file description
 */
import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'

export type CommunityCheckinItemForEntity = {
  communityId: number
  seqDays: number
  contribution: number
}
type CommunitysState = EntityState<CommunityCheckinItemForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}

// 列表信息，标准化数据为实体对象
export const userCheckinCommunitiesEntity = createEntityAdapter<CommunityCheckinItemForEntity>({
  selectId: (item) => item.communityId,
})
// 初始化列表信息
const CommunitysState: CommunitysState = userCheckinCommunitiesEntity.getInitialState({
  status: AsyncRequestStatus.FULFILLED,
  errorMsg: '',
  currentRequestId: undefined,
})

export const userCheckinCommunitiesSlice = createSlice({
  name: 'userCheckinCommunities',
  initialState: CommunitysState,
  reducers: {
    addOne: (state, action: PayloadAction<CommunityCheckinItemForEntity>) => {
      const one = action.payload
      userCheckinCommunitiesEntity.addOne(state, one)
    },
    removeAll: (state) => {
      userCheckinCommunitiesEntity.removeAll(state)
    },
  },
})

export const { selectAll, selectIds, selectById } = userCheckinCommunitiesEntity.getSelectors(
  (state: RootState) => state.userCheckinCommunities,
)
export const selecteCheckinState = (state: RootState) => state.userCheckinCommunities
const { reducer, actions } = userCheckinCommunitiesSlice
export const { addOne, removeAll } = actions
export default reducer
