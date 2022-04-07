import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
import log from 'loglevel'

import { RootState } from '../../store/store'

import { Contract, NFT } from '../../synft'

type Token = {
  mint: PublicKey
  address: PublicKey
}

// Define a type for the slice state
interface MyNFT {
  err: string
  nfts: Token[]
  loading: boolean
  data: NFT[]
  status: 'init' | 'loading' | 'done'
}

// Define the initial state using that type
const initialState: MyNFT = {
  nfts: [],
  loading: false,
  data: [],
  status: 'init',
  err: '',
}

export const getMyNFTokens = createAsyncThunk('my/nftdata', async ({ owner }: { owner: PublicKey }, thunkAPI) => {
  const contract = Contract.getInstance()
  log.info('init myNFTData with wallet.publicKey', owner.toString())
  const filteredTokens = await contract.getValidNFTokensWithOwner(owner)
  thunkAPI.dispatch(getMyNFTData({ nfts: filteredTokens }))
  return filteredTokens
})

export const getMyNFTData = createAsyncThunk('my/nftmetadata', async ({ nfts }: { nfts: Token[] }, thunkAPI) => {
  const contract = Contract.getInstance()
  thunkAPI.dispatch(myNFTSlice.actions.changeStatus({ status: 'loading' }))
  const data = await Promise.all(
    nfts.map(async (item) => {
      try {
        const metadataInfo = await contract.getMetadataInfoWithMint(item.mint)
        if (!metadataInfo) return null
        const {hasInjected,hasInjectedNFT} = await contract.checkHasInject(item.mint)
        return {
          image: metadataInfo.externalMetadata.image,
          mint: metadataInfo.metadata.mint,
          name: metadataInfo.externalMetadata.name,
          hasInjected,
          hasInjectedNFT
        }
      } catch (error) {
        return null
      }
    }),
  )
  const validData = data.filter((item) => item !== null)
  thunkAPI.dispatch(myNFTSlice.actions.incrDataWithArr({ data: validData }))
  thunkAPI.dispatch(myNFTSlice.actions.changeStatus({ status: 'done' }))
})

export const myNFTSlice = createSlice({
  name: 'my/collection',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    clearMyNFT: (state) => {
      state.status = 'init'
      state.nfts = []
      state.data = []
    },
    changeStatus: (state, action) => {
      state.status = action.payload.status
    },
    incrData: (state, action) => {
      // TODO: check item exist
      state.data.push(action.payload.data)
    },
    incrDataWithArr: (state, action) => {
      state.data = action.payload.data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNFTokens.pending, (state) => {
        state.loading = true
      })
      .addCase(getMyNFTokens.fulfilled, (state, action) => {
        state.loading = false
        state.nfts = action.payload
      })
      .addCase(getMyNFTokens.rejected, (state, action) => {
        state.loading = false
        state.err = action.error.message || 'failed'
      })
  },
})

export const selectMyNFTData = (state: RootState) => state.mynft.data
export const selectMyNFTDataStatus = (state: RootState) => state.mynft.status

export const { clearMyNFT } = myNFTSlice.actions

export default myNFTSlice.reducer
