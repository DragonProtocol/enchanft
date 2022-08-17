/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 15:31:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 13:42:25
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import fileDownload from 'js-file-download'
import { toast } from 'react-toastify'
import { downloadContributions, followCommunity, FollowCommunityParams } from '../../services/api/community'
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
  downloadContributionTokens: CommunityHandle<number>
}
const initUserCommunityHandlesState: UserCommunityHandlesStateType = {
  follow: initCommunityHandlestate,
  downloadContributionTokens: initCommunityHandlestate,
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
export const downloadContributionTokens = createAsyncThunk(
  'user/communityHandles/downloadContributionTokens',
  async (communityId: number) => {
    try {
      const resp = await downloadContributions(communityId)
      fileDownload(resp.data, 'contribution_tokens.csv')
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
        toast.success('follow success')
      })
      .addCase(follow.rejected, (state, action) => {
        console.log('follow rejected', action)
        state.follow.params = null
        state.follow.status = AsyncRequestStatus.REJECTED
        state.follow.errorMsg = action.error.message || ''
        toast.error(action.error.message)
      })
      .addCase(downloadContributionTokens.pending, (state, action) => {
        console.log('downloadContributionTokens pending', action)
        state.downloadContributionTokens.params = action.meta.arg
        state.downloadContributionTokens.status = AsyncRequestStatus.PENDING
        state.downloadContributionTokens.errorMsg = ''
      })
      .addCase(downloadContributionTokens.fulfilled, (state, action) => {
        console.log('downloadContributionTokens fulfilled', action)
        state.downloadContributionTokens.params = null
        state.downloadContributionTokens.status = AsyncRequestStatus.FULFILLED
        state.downloadContributionTokens.errorMsg = ''
        toast.success('download tokens success')
      })
      .addCase(downloadContributionTokens.rejected, (state, action) => {
        console.log('downloadContributionTokens rejected', action)
        state.downloadContributionTokens.params = null
        state.downloadContributionTokens.status = AsyncRequestStatus.REJECTED
        state.downloadContributionTokens.errorMsg = action.error.message || ''
        toast.error(action.error.message)
      })
  },
})

export const selectUserCommunityHandlesState = (state: RootState) => state.userCommunityHandles

const { actions, reducer } = userCommunityHandlesSlice

export default reducer
