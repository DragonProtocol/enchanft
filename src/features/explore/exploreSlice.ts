import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Connection, PublicKey } from '@solana/web3.js'
import log from 'loglevel'

import { RootState } from '../../store/store'

import { Contract, NFT } from '../../synft'
import { loadExploreNFT } from './exploreData'

interface ExploreNFT {
  hasGetCollectionIds: string[]
  data: NFT[]
  status: 'init' | 'loading' | 'done'
  err: string
}

const initialState: ExploreNFT = {
  hasGetCollectionIds: [],
  data: [],
  status: 'init',
  err: '',
}

export const getExploreData = createAsyncThunk(
  'explore/nftdata',
  async ({ collectionIds, connection }: { collectionIds: string[]; connection: Connection }) => {
    const contract = Contract.getInstance()
    const dataArr = await Promise.all(
      collectionIds.map(async (collectionID) => {
        const d: NFT[] = await loadExploreNFT(collectionID)
        await Promise.all(
          d.map(async (item) => {
            try {
              const mintKey = new PublicKey(item.mint)
              const hasCopied = await contract.getMintAccountInfo(mintKey)
              item.hasCopied = !!hasCopied
            } catch (error) {
              log.error(error)
            }
          }),
        )
        return d
      }),
    )
    const data = dataArr.reduce((a, b) => a.concat(b), [])
    return data
  },
)

export const getExploreDataWithCollectionId = createAsyncThunk(
  'explore/nftDataWithCollectionId',
  async ({ collectionId }: { collectionId: string }, thunkAPI) => {
    const contract = Contract.getInstance()
    const d: NFT[] = await loadExploreNFT(collectionId)
    await Promise.all(
      d.map(async (item) => {
        try {
          const mintKey = new PublicKey(item.mint)
          const hasCopied = await contract.getMintAccountInfo(mintKey)
          item.hasCopied = !!hasCopied
        } catch (error) {
          log.error(error)
        }
      }),
    )
    thunkAPI.dispatch(exploreSlice.actions.incrData({ data: d, collectionId }))
  },
)

export const exploreSlice = createSlice({
  name: 'explore/collection',
  initialState,
  reducers: {
    incrData: (state, action) => {
      if (!state.hasGetCollectionIds.includes(action.payload.collectionId)) {
        state.data = state.data.concat(action.payload.data)
        state.hasGetCollectionIds.push(action.payload.collectionId)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExploreData.pending, (state) => {
        if (state.status === 'init') state.status = 'loading'
      })
      .addCase(getExploreData.fulfilled, (state, action) => {
        state.status = 'done'
        state.data = action.payload
      })
      .addCase(getExploreData.rejected, (state, action) => {
        state.status = 'done'
        state.err = action.error.message || 'failed'
      })
      .addCase(getExploreDataWithCollectionId.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getExploreDataWithCollectionId.fulfilled, (state, action) => {
        state.status = 'done'
      })
      .addCase(getExploreDataWithCollectionId.rejected, (state, action) => {
        log.error(action.error)
        state.status = 'done'
      })
  },
})

export const selectExploreDataHasGetCollectionIds = (state: RootState) => state.explore.hasGetCollectionIds
export const selectExploreData = (state: RootState) => state.explore.data
export const selectExploreStatus = (state: RootState) => state.explore.status
export const selectExploreErr = (state: RootState) => state.explore.err

export default exploreSlice.reducer
