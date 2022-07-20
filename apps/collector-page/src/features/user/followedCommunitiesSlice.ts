import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchListForUserFollowedCommunity } from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { FollowedCommunityItem } from '../../types/api'

export type FollowedCommunitityForEntity = FollowedCommunityItem
type FollowedCommunityListState = EntityState<FollowedCommunitityForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
export const userFollowedCommunitiesEntity = createEntityAdapter<FollowedCommunitityForEntity>({
  selectId: (item) => item.id,
})
const initTodoTasksState: FollowedCommunityListState = userFollowedCommunitiesEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

type FetchFollowedCommunitiesResp = {
  data: FollowedCommunityItem[]
  errorMsg?: string
}

export const fetchFollowedCommunities = createAsyncThunk<
  FetchFollowedCommunitiesResp,
  undefined,
  {
    rejectValue: FetchFollowedCommunitiesResp
  }
>(
  'user/followedCommunities/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForUserFollowedCommunity()
      return { data: resp.data.data || [] }
    } catch (error: any) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue({
        data: [],
        errorMsg: error.response.data,
      })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        userFollowedCommunities: { status },
        account: { token },
      } = state
      // 没有token ,则阻止新的请求
      if (!token) {
        userFollowedCommunitiesEntity.removeAll(state.userFollowedCommunities)
        return false
      }
      // 之前的请求正在进行中,则阻止新的请求
      // if (status === AsyncRequestStatus.PENDING) {
      //   return false
      // }
      return true
    },
  },
)

export const userFollowedCommunitiesSlice = createSlice({
  name: 'userFollowedCommunities',
  initialState: initTodoTasksState,
  reducers: {
    addOne: (state, action) => {
      const one = action.payload
      userFollowedCommunitiesEntity.addOne(state, one)
    },
    removeOne: (state, action) => {
      const id = action.payload
      userFollowedCommunitiesEntity.removeOne(state, id)
    },
    updateOne: (state, action) => {
      const one = action.payload
      userFollowedCommunitiesEntity.upsertOne(state, one)
    },
    removeAll: (state) => {
      userFollowedCommunitiesEntity.removeAll(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowedCommunities.pending, (state, action) => {
        console.log('fetchFollowedCommunities.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchFollowedCommunities.fulfilled, (state, action) => {
        console.log('fetchFollowedCommunities.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        // set data
        userFollowedCommunitiesEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchFollowedCommunities.rejected, (state, action) => {
        console.log('fetchFollowedCommunities.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        userFollowedCommunitiesEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = userFollowedCommunitiesSlice
export const selectuserFollowedCommunitiesState = (state: RootState) => state.userFollowedCommunities
export const { selectAll, selectIds } = userFollowedCommunitiesEntity.getSelectors(
  (state: RootState) => state.userFollowedCommunities,
)
export const { addOne, removeOne, updateOne, removeAll } = actions
export default reducer
