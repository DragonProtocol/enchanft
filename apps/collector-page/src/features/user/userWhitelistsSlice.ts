import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchListForUserWhitelist } from '../../services/api/whitelist'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { UserWhitelistItem } from '../../types/api'

export type UserWhitelistForEntity = UserWhitelistItem & {
  id: number
}
type WhitelistListState = EntityState<UserWhitelistForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
export const userWhitelistsEntity = createEntityAdapter<UserWhitelistForEntity>({
  selectId: (item) => item.id,
})
const initTodoTasksState: WhitelistListState = userWhitelistsEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

type FetchWhitelistsResp = {
  data: UserWhitelistItem[]
  errorMsg?: string
}

export const fetchUserWhitelists = createAsyncThunk<
  FetchWhitelistsResp,
  undefined,
  {
    rejectValue: FetchWhitelistsResp
  }
>(
  'user/whitelists/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const resp = await fetchListForUserWhitelist()
      const data = resp.data.data.map((item) => ({ ...item, id: item.reward.id }))
      return { data: data || [] }
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
        userWhitelists: { status },
        account: { token },
      } = state
      // 没有token ,则阻止新的请求
      if (!token) {
        userWhitelistsEntity.removeAll(state.userWhitelists)
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

export const userWhitelistsSlice = createSlice({
  name: 'userWhitelists',
  initialState: initTodoTasksState,
  reducers: {
    addOne: (state, action) => {
      const one = action.payload
      userWhitelistsEntity.addOne(state, one)
    },
    removeOne: (state, action) => {
      const id = action.payload
      userWhitelistsEntity.removeOne(state, id)
    },
    updateOne: (state, action) => {
      const one = action.payload
      userWhitelistsEntity.upsertOne(state, one)
    },
    removeAll: (state) => {
      userWhitelistsEntity.removeAll(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWhitelists.pending, (state, action) => {
        console.log('fetchUserWhitelists.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchUserWhitelists.fulfilled, (state, action) => {
        console.log('fetchUserWhitelists.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        // set data
        userWhitelistsEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchUserWhitelists.rejected, (state, action) => {
        console.log('fetchUserWhitelists.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        userWhitelistsEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

const { actions, reducer } = userWhitelistsSlice
export const selectUserWhitelistsState = (state: RootState) => state.userWhitelists
export const { selectAll, selectIds } = userWhitelistsEntity.getSelectors((state: RootState) => state.userWhitelists)
export const { addOne, removeOne, updateOne, removeAll } = actions
export default reducer
