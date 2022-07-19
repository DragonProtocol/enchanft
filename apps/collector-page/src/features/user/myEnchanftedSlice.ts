/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 17:57:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-19 13:15:08
 * @Description: 用户注入过token的nft列表数据
 */
import SynftContract from '@ecnft/js-sdk-core'
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit'
import { Connection, PublicKey } from '@solana/web3.js'
import axios from 'axios'
import log from 'loglevel'
import { NFTDataItem } from '../../types/synft'
import { getInjectSOLFromMints, getMetadataFormMints, getValidNFTokensWithOwner } from '../../utils/metadata'
import { RootState } from '../../store/store'
import { AsyncRequestStatus } from '../../types'

export type EnchanftedForEntity = NFTDataItem
type EnchanftedListState = EntityState<EnchanftedForEntity> & {
  status: AsyncRequestStatus
  errorMsg: string
  currentRequestId: string | undefined // 当前正在请求的id(由createAsyncThunk生成的唯一id)
}
export const myEnchanftedEntity = createEntityAdapter<EnchanftedForEntity>({
  selectId: (item) => item.mint,
})
const initEnchanftedState: EnchanftedListState = myEnchanftedEntity.getInitialState({
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  currentRequestId: undefined,
})

type fetchMyEnchanftedParams = {
  owner: PublicKey
  connection: Connection
  synftContract: SynftContract
}
type FetchMyEnchanftedResp = {
  data: NFTDataItem[]
  errorMsg?: string
}
export const fetchMyEnchanfted = createAsyncThunk<
  FetchMyEnchanftedResp,
  fetchMyEnchanftedParams,
  {
    rejectValue: FetchMyEnchanftedResp
  }
>('user/enchanfted/fetchList', async ({ owner, connection, synftContract }, thunkAPI) => {
  log.info('init myNFTData with wallet.publicKey', owner.toString())
  const filteredTokens = await getValidNFTokensWithOwner(owner, connection)
  const mints = filteredTokens.map((item) => item.mint)
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
          mint: metadata.mint.toString(),
          name: externalMetadata.name,
          injectSolAmount: injectSOls[index]?.lamports || 0,
          externalMetadata,
        }
      } catch (err) {
        return null
      }
    }),
  )

  const validData = data.filter((item) => item !== null) as NFTDataItem[]
  return {
    data: validData,
    errorMsg: '',
  }
})

export const myEnchanftedSlice = createSlice({
  name: 'user/myEnchanfted',
  initialState: initEnchanftedState,
  reducers: {
    clearMyNFT: (state) => {
      myEnchanftedEntity.setAll(state, [])
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnchanfted.pending, (state, action) => {
        console.log('fetchMyEnchanfted.pending', action)
        state.status = AsyncRequestStatus.PENDING
        state.errorMsg = ''
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchMyEnchanfted.fulfilled, (state, action) => {
        console.log('fetchMyEnchanfted.fulfilled', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.FULFILLED
        myEnchanftedEntity.setAll(state, action.payload.data)
      })
      .addCase(fetchMyEnchanfted.rejected, (state, action) => {
        console.log('fetchMyEnchanfted.rejected', action)
        const { requestId } = action.meta
        // 前后两次不同的请求，使用最后一次请求返回的数据
        if (state.currentRequestId !== requestId || state.status !== AsyncRequestStatus.PENDING) return
        state.status = AsyncRequestStatus.REJECTED
        myEnchanftedEntity.setAll(state, [])
        if (action.payload) {
          state.errorMsg = action.payload.errorMsg || ''
        } else {
          state.errorMsg = action.error.message || ''
        }
      })
  },
})

export const selectMyEnchanftedState = (state: RootState) => state.myEnchanfted
export const { selectAll } = myEnchanftedEntity.getSelectors((state: RootState) => state.myEnchanfted)
const { reducer, actions } = myEnchanftedSlice
export const { clearMyNFT } = actions
export default reducer
