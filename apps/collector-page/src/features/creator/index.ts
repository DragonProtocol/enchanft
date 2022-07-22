import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { creatorApi } from '../../services/api/creator'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'

type CreatorState = {
  status: AsyncRequestStatus
  taskData: any
  winnerListData: any
  taskTitleData: any
  scheduleData: any
}

// 站点状态信息
const creatorState: CreatorState = {
  status: AsyncRequestStatus.IDLE,
  taskData: {},
  winnerListData: {},
  taskTitleData: {},
  scheduleData: {},
}

export const getCreatorData = createAsyncThunk('creator/data', async () => {
  const resp = await creatorApi({})
  return resp.data
})

export const creatorSlice = createSlice({
  name: 'website',
  initialState: creatorState,
  reducers: {
    some: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCreatorData.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(getCreatorData.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
      })
      .addCase(getCreatorData.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
      })
  },
})

const { actions, reducer } = creatorSlice
// export const { switchOpenMenu } = actions
export const selectCreator = (state: RootState) => state.creator
export default reducer
