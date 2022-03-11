import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../../store/store'

import { loadExploreNFT, NFT } from './exploreData'

interface ExploreNFT {
  data: NFT[]
  status: 'init' | 'loading' | 'done'
  err: string
}

const initialState: ExploreNFT = {
  data: [],
  status: 'init',
  err: '',
}

export const getExploreData = createAsyncThunk(
  'explore/nftdata',
  async ({ collectionID }: { collectionID: string }) => {
    const data: NFT[] = await loadExploreNFT(collectionID)
    return data
  },
)

export const exploreSlice = createSlice({
  name: 'explore/collection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExploreData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getExploreData.fulfilled, (state, action) => {
        state.status = 'done'
        state.data = action.payload
      })
      .addCase(getExploreData.rejected, (state, action) => {
        state.status = 'done'
        state.err = action.error.message || 'failed'
      })
  },
})

export const selectExploreData = (state: RootState) => state.explore.data
export const selectExploreStatus = (state: RootState) => state.explore.status
export const selectExploreErr = (state: RootState) => state.explore.err

export default exploreSlice.reducer
