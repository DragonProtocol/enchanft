/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 15:31:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 16:48:52
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { followCommunity, FollowCommunityParams } from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { addOne as addOneForFollowedCommunities, fetchFollowedCommunities } from './followedCommunitiesSlice'
// 每一种操作单独存储当前的数据状态
export type CommunityHandle<T> = {
  params: T | null
  status: AsyncRequestStatus
  errorMsg: string
}
const initCommunityHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
}
// 将操作集合到一起，统一管理
export type UserCommunityHandlesStateType = {
  follow: CommunityHandle<FollowCommunityParams>
}
const initUserCommunityHandlesState: UserCommunityHandlesStateType = {
  follow: initCommunityHandlestate,
}
export const follow = createAsyncThunk(
  'user/communityHandles/follow',
  async (params: FollowCommunityParams, { dispatch }) => {
    try {
      const resp = await followCommunity(params)
      if (resp.data.code === 0) {
        const addFollowedCommunity = { id: params.id }
        dispatch(addOneForFollowedCommunities(addFollowedCommunity))
        dispatch(fetchFollowedCommunities())
      } else {
        throw new Error(resp.data.msg)
      }
      return { errorMsg: '' }
    } catch (error) {
      throw error
    }
  },
)
export const userCommunityHandlesSlice = createSlice({
  name: 'CommunityHandles',
  initialState: initUserCommunityHandlesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(follow.pending, (state, action) => {
        console.log('follow pending', action)
        state.follow.params = action.meta.arg
        state.follow.status = AsyncRequestStatus.PENDING
        state.follow.errorMsg = ''
      })
      .addCase(follow.fulfilled, (state, action) => {
        console.log('follow fulfilled', action)
        state.follow.params = null
        state.follow.status = AsyncRequestStatus.FULFILLED
        state.follow.errorMsg = ''
      })
      .addCase(follow.rejected, (state, action) => {
        console.log('follow rejected', action)
        state.follow.params = null
        state.follow.status = AsyncRequestStatus.REJECTED
        state.follow.errorMsg = action.error.message || ''
      })
  },
})

export const selectfollow = (state: RootState) => state.userCommunityHandles.follow
export const selectUserCommunityHandlesState = (state: RootState) => state.userCommunityHandles

const { actions, reducer } = userCommunityHandlesSlice

export default reducer
