/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 17:57:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:20:53
 * @Description: 用户注入过token的nft列表数据
 */
import SynftContract from '@enchanft/js-sdk-core'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Connection, PublicKey } from '@solana/web3.js'
import axios from 'axios'
import log from 'loglevel'
import { NFT } from 'types/synft'
import { getMetadataFormMints, getValidNFTokensWithOwner } from 'utils/metadata'
import { RootState } from '../../store/store'

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
  'user/getMyNFTData',
  async (
    { nfts, connection, synftContract }: { nfts: Token[]; connection: Connection; synftContract: SynftContract },
    thunkAPI,
  ) => {
    thunkAPI.dispatch(myEnchanftedSlice.actions.changeStatus({ status: 'loading' }))
    const mints = nfts.map((item) => item.mint)
    const metadatas = await getMetadataFormMints(mints, connection)
    const data = await Promise.all(
      metadatas.map(async (metadata) => {
        try {
          const externalMetadata = (await axios.get(metadata.data.uri)).data
          const { hasInjected, hasInjectedNFT } = await synftContract.checkHasInject(metadata.mint)
          return {
            image: externalMetadata.image,
            mint: metadata.mint,
            name: externalMetadata.name,
            hasInjected,
            hasInjectedNFT,
            externalMetadata,
          }
        } catch (err) {
          return null
        }
      }),
    )

    const validData = data.filter((item) => item !== null)
    thunkAPI.dispatch(myEnchanftedSlice.actions.incrDataWithArr({ data: validData }))
    thunkAPI.dispatch(myEnchanftedSlice.actions.changeStatus({ status: 'done' }))
  },
)

export const myEnchanftedSlice = createSlice({
  name: 'user/myEnchanfted',
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

export const selectMyNFTData = (state: RootState) => state.myEnchanfted.data
export const selectMyNFTDataStatus = (state: RootState) => state.myEnchanfted.status

export const { clearMyNFT } = myEnchanftedSlice.actions

export default myEnchanftedSlice.reducer
