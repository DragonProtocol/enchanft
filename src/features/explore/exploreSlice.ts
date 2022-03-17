import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Connection, PublicKey } from '@solana/web3.js'
import log from 'loglevel'

import { RootState } from '../../store/store'

import idl, { Synft, programId, Contract } from '../../synft'
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

export const exploreSlice = createSlice({
  name: 'explore/collection',
  initialState,
  reducers: {},
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
  },
})

export const selectExploreData = (state: RootState) => state.explore.data
export const selectExploreStatus = (state: RootState) => state.explore.status
export const selectExploreErr = (state: RootState) => state.explore.err

export default exploreSlice.reducer
