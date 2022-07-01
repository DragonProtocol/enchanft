import SynftContract from '@enchanft/js-sdk-core'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Connection, PublicKey } from '@solana/web3.js'
import axios from 'axios'
import log from 'loglevel'
import { RootState } from '../../store/store'

import { NFT } from '../../synft'
import { getInjectSOLFromMints, getMetadataFormMints, getValidNFTokensWithOwner } from '../../utils'

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

export const getMyNFTokens = createAsyncThunk(
  'my/nftdata',
  async (
    { owner, connection, synftContract }: { owner: PublicKey; connection: Connection; synftContract: SynftContract },
    thunkAPI,
  ) => {
    log.info('init myNFTData with wallet.publicKey', owner.toString())
    const filteredTokens = await getValidNFTokensWithOwner(owner, connection)
    thunkAPI.dispatch(getMyNFTData({ nfts: filteredTokens, connection, synftContract }))
    return filteredTokens
  },
)

export const getMyNFTData = createAsyncThunk(
  'my/nftmetadata',
  async (
    { nfts, connection, synftContract }: { nfts: Token[]; connection: Connection; synftContract: SynftContract },
    thunkAPI,
  ) => {
    thunkAPI.dispatch(myNFTSlice.actions.changeStatus({ status: 'loading' }))
    const mints = nfts.map((item) => item.mint)
    const metadatas = await getMetadataFormMints(mints, connection)
    const injectSOls = await getInjectSOLFromMints(mints, connection)
    log.debug('mints', mints)
    log.debug('metadatas', metadatas)
    log.debug('injectSOls', injectSOls)
    const data = await Promise.all(
      metadatas.map(async (metadata, index) => {
        if (!metadata) return null
        try {
          const externalMetadata = (await axios.get(metadata.data.uri)).data
          return {
            image: externalMetadata.image,
            mint: metadata.mint,
            name: externalMetadata.name,
            injectSolAmount: injectSOls[index]?.lamports || 0,
            externalMetadata,
          }
        } catch (err) {
          return null
        }
      }),
    )

    const validData = data.filter((item) => item !== null)
    thunkAPI.dispatch(myNFTSlice.actions.incrDataWithArr({ data: validData }))
    thunkAPI.dispatch(myNFTSlice.actions.changeStatus({ status: 'done' }))
  },
)

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
