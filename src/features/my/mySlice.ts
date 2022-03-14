import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Connection, PublicKey } from '@solana/web3.js'
import log from 'loglevel'

import { RootState } from '../../store/store'

import { getMySPLToken, getMetadataFromMint } from './myData'

type Token = {
  mint: PublicKey
  address: PublicKey
}

// Define a type for the slice state
interface MyNFT {
  walletAddr: string
  loading: boolean
  err: string
  nfts: Token[]
  metadata: any[]
  metadataStatus: 'init' | 'loading' | 'done'
}

// Define the initial state using that type
const initialState: MyNFT = {
  walletAddr: '',
  loading: false,
  nfts: [],
  metadata: [],
  metadataStatus: 'init',
  err: '',
}

export const getMyNFTData = createAsyncThunk(
  'my/nftdata',
  async ({ connection, owner }: { connection: Connection; owner: PublicKey }, thunkAPI) => {
    log.info('init myNFTData with wallet.publicKey', owner.toString())
    const data = await getMySPLToken(connection, owner)
    thunkAPI.dispatch(getMyNFTMetadata({ connection, nfts: data }))
    return data
  },
)

export const getMyNFTMetadata = createAsyncThunk(
  'my/nftmetadata',
  async ({ connection, nfts }: { connection: Connection; nfts: Token[] }, thunkAPI) => {
    thunkAPI.dispatch(myNFTSlice.actions.changeMetadataStatus({ status: 'loading' }))
    const data = await Promise.all(
      nfts.map(async (item) => {
        try {
          const metadata = await getMetadataFromMint(connection, item.mint)
          return metadata
        } catch (error) {
          return null
        }
      }),
    )
    const validData = data.filter((item) => item !== null)
    thunkAPI.dispatch(myNFTSlice.actions.incrMetadataWithArr({ data: validData }))
    thunkAPI.dispatch(myNFTSlice.actions.changeMetadataStatus({ status: 'done' }))
  },
)

export const myNFTSlice = createSlice({
  name: 'my/collection',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    clearMyNFT: (state) => {
      state.metadataStatus = 'init'
      state.nfts = []
      state.metadata = []
    },
    changeMetadataStatus: (state, action) => {
      state.metadataStatus = action.payload.status
    },
    incrMetadata: (state, action) => {
      // TODO: check item exist
      state.metadata.push(action.payload.data)
    },
    incrMetadataWithArr: (state, action) => {
      state.metadata = action.payload.data
    },
    setWalletAddr: (state, action) => {
      state.walletAddr = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNFTData.pending, (state) => {
        state.loading = true
      })
      .addCase(getMyNFTData.fulfilled, (state, action) => {
        state.loading = false
        state.nfts = action.payload
      })
      .addCase(getMyNFTData.rejected, (state, action) => {
        state.loading = false
        state.err = action.error.message || 'failed'
      })
  },
})

// Other code such as selectors can use the imported `RootState` type
export const selectMyNFTs = (state: RootState) => state.mynft.nfts
export const selectMyNFTMetadataArr = (state: RootState) => state.mynft.metadata
export const selectMyNFTMetadataStatus = (state: RootState) => state.mynft.metadataStatus
export const selectMyWalletAddr = (state: RootState) => state.mynft.walletAddr

export const { setWalletAddr, clearMyNFT } = myNFTSlice.actions

export default myNFTSlice.reducer
