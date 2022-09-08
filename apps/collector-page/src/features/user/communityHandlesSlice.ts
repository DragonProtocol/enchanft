/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-15 15:31:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-08 15:36:46
 * @Description: file description
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import fileDownload from 'js-file-download'
import { toast } from 'react-toastify'
import {
  checkinCommunity,
  downloadContributions,
  followCommunity,
  FollowCommunityParams,
  verifyCommunityCheckin,
} from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { fetchCommunityContributionRanks } from '../community/contributionRanksSlice'
import { fetchUserContributon } from '../contribution/userContributionSlice'
import { addOne as addOneForCheckinCommunities } from './checkinCommunitiesSlice'
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
  verifyCheckin: CommunityHandle<{ communityId?: number; slug?: string }>
  checkin: CommunityHandle<number> & {
    openClaimModal?: boolean
  }
}
const initUserCommunityHandlesState: UserCommunityHandlesStateType = {
  follow: initCommunityHandlestate,
  downloadContributionTokens: initCommunityHandlestate,
  verifyCheckin: initCommunityHandlestate,
  checkin: initCommunityHandlestate,
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

export const verifyCheckin = createAsyncThunk(
  'user/communityHandles/verifyCheckin',
  async (communityId: number, { dispatch, getState }) => {
    try {
      const resp = await verifyCommunityCheckin(communityId)
      if (resp.data.code === 0) {
        if (resp.data.data === 1) {
          const addCheckinCommunity = { communityId, seqDays: 1, contribution: 0 }
          dispatch(addOneForCheckinCommunities(addCheckinCommunity))
        }
      } else {
        throw new Error(resp.data.msg)
      }
      return { errorMsg: '' }
    } catch (error) {
      throw error
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        account: { isLogin },
      } = state
      // 没有登录,则阻止请求
      if (!isLogin) {
        return false
      }
      return true
    },
  },
)

export const checkin = createAsyncThunk(
  'user/communityHandles/checkin',
  async ({ communityId, slug }: { communityId: number; slug?: string }, { dispatch }) => {
    try {
      const resp = await checkinCommunity(communityId)
      if (resp.data.code === 0) {
        const { seqDays, contribution } = resp.data.data
        const addCheckinCommunity = { communityId, seqDays: seqDays || 0, contribution: contribution || 0 }
        dispatch(addOneForCheckinCommunities(addCheckinCommunity))
        if (slug) {
          dispatch(fetchCommunityContributionRanks(slug))
          dispatch(fetchUserContributon(slug))
        }
        toast.success(`Got ${addCheckinCommunity.contribution} contribution token!`)
        dispatch(setCheckinOpenClaimModal(true))
        setTimeout(() => {
          dispatch(setCheckinOpenClaimModal(false))
        }, 3000)
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
  reducers: {
    resetVerifyCheckin: (state) => {
      state.verifyCheckin = initCommunityHandlestate
    },
    setCheckinOpenClaimModal: (state, action: PayloadAction<boolean>) => {
      state.checkin.openClaimModal = action.payload
    },
  },
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
      .addCase(verifyCheckin.pending, (state, action) => {
        console.log('verifyCheckin pending', action)
        state.verifyCheckin.params = action.meta.arg
        state.verifyCheckin.status = AsyncRequestStatus.PENDING
        state.verifyCheckin.errorMsg = ''
      })
      .addCase(verifyCheckin.fulfilled, (state, action) => {
        console.log('verifyCheckin fulfilled', action)
        state.verifyCheckin.params = null
        state.verifyCheckin.status = AsyncRequestStatus.FULFILLED
        state.verifyCheckin.errorMsg = ''
      })
      .addCase(verifyCheckin.rejected, (state, action) => {
        console.log('verifyCheckin rejected', action)
        state.verifyCheckin.params = null
        state.verifyCheckin.status = AsyncRequestStatus.REJECTED
        state.verifyCheckin.errorMsg = action.error.message || ''
        toast.error(action.error.message)
      })
      .addCase(checkin.pending, (state, action) => {
        console.log('checkin pending', action)
        state.checkin.params = action.meta.arg
        state.checkin.status = AsyncRequestStatus.PENDING
        state.checkin.errorMsg = ''
      })
      .addCase(checkin.fulfilled, (state, action) => {
        console.log('checkin fulfilled', action)
        state.checkin.params = null
        state.checkin.status = AsyncRequestStatus.FULFILLED
        state.checkin.errorMsg = ''
      })
      .addCase(checkin.rejected, (state, action) => {
        console.log('checkin rejected', action)
        state.checkin.params = null
        state.checkin.status = AsyncRequestStatus.REJECTED
        state.checkin.errorMsg = action.error.message || ''
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
export const { resetVerifyCheckin, setCheckinOpenClaimModal } = actions
export default reducer
