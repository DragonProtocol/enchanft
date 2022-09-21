import { EntityState, createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { fetchListForCommunityContributionRank } from '../../services/api/community'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'
import { CommunityContributionRankItem } from '../../types/api'
import { setAvatar, setName, setPubkey, setToken } from '../user/accountSlice'

export type CommunityContributionRanksItemForEntity = CommunityContributionRankItem
type CommunitysState = EntityState<CommunityContributionRanksItemForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
type FetchListResp = {
  data: CommunityContributionRanksItemForEntity[]
  errorMsg?: string
}

// 列表信息，标准化数据为实体对象
export const communityContributionRanksEntity = createEntityAdapter<CommunityContributionRanksItemForEntity>({
  selectId: (item) => item.pubkey,
})
// 初始化列表信息
const CommunitysState: CommunitysState = communityContributionRanksEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

export const fetchCommunityContributionRanks = createAsyncThunk<
  FetchListResp,
  string,
  {
    rejectValue: FetchListResp
  }
>(
  'community/fetchCommunityContributionRanks',
  async (slug, { rejectWithValue, dispatch }) => {
    try {
      const resp = await fetchListForCommunityContributionRank(slug)
      return { data: resp.data.data || [] }
    } catch (error: any) {
      const err: AxiosError = error as any
      if (err.response?.status === 401) {
        dispatch(setAvatar(''))
        dispatch(setName(''))
        dispatch(setToken(''))
        dispatch(setPubkey(''))
      }
      if (!error.response) {
        throw error
      }
      return rejectWithValue({ data: [], errorMsg: error.response.data })
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        communityContributionRanks: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const communityContributionRanksSlice = createSlice({
  name: 'communityContributionRanks',
  initialState: CommunitysState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityContributionRanks.pending, (state, action) => {
        console.log('fetchCommunityContributionRanks.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchCommunityContributionRanks.fulfilled, (state, action) => {
        console.log('fetchCommunityContributionRanks.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        communityContributionRanksEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchCommunityContributionRanks.rejected, (state, action) => {
        console.log('fetchCommunityContributionRanks.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        communityContributionRanksEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const { selectAll } = communityContributionRanksEntity.getSelectors(
  (state: RootState) => state.communityContributionRanks,
)
export const selecteContributionRanksState = (state: RootState) => state.communityContributionRanks
const { reducer } = communityContributionRanksSlice
export default reducer
