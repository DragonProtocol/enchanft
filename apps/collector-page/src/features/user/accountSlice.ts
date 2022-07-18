/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-13 11:48:36
 * @Description: 用户的账户信息
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'
import { login, updateProfile, link } from '../../services/api/login'
import { AsyncRequestStatus } from '../../types'

export type AccountState = {
  status: AsyncRequestStatus
  errorMsg?: string
  token: string
  avatar: string
  name: string
  twitter: string
  discord: string
}

// 用户账户信息
const initialState: AccountState = {
  status: AsyncRequestStatus.IDLE,
  token: '',
  avatar: '',
  name: '',
  twitter: localStorage.getItem('twitter') || '',
  discord: localStorage.getItem('discord') || '',
}

export const userLogin = createAsyncThunk(
  'user/login',
  async ({ signature, payload, pubkey }: { signature: string; payload: string; pubkey: string }) => {
    const resp = await login({
      signature,
      payload,
      pubkey,
    })
    return resp.data
  },
)

export const userUpdateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ avatar, name, pubkey }: { avatar: string; name: string; pubkey: string }, thunkAPI) => {
    const resp = await updateProfile({
      userAvatar: avatar,
      userName: name,
      pubkey,
    })
    thunkAPI.dispatch(setName(name))
    return resp.data
  },
)

export const userLink = createAsyncThunk(
  'user/userLink',
  async ({ code,type }: { code: string,type: string }, thunkAPI) => {
    const resp = await link({
      code,
    })
    const { twitter,discord } = resp.data
    if(discord){
      thunkAPI.dispatch(setDiscord(discord))
    }
    if(twitter){
      thunkAPI.dispatch(setTwitter(twitter))
    }

    return resp.data
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        account: { status },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    removeToken: (state) => {
      state.token = ''
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setTwitter: (state, action) => {
      state.twitter = action.payload
      localStorage.setItem('twitter', action.payload)
    },
    setDiscord: (state, action) => {
      state.discord = action.payload
      localStorage.setItem('discord', action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
        state.token = action.payload.token
        state.avatar = action.payload.avatar
        state.name = action.payload.name
        state.twitter = action.payload.twitter
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
      })
      ///////
      .addCase(userLink.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userLink.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
      })
      ///////
      .addCase(userUpdateProfile.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userUpdateProfile.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
      })
      .addCase(userUpdateProfile.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
      })
  },
})

const { actions, reducer } = accountSlice
export const { setToken, removeToken, setName, setTwitter,setDiscord } = actions
export const selectAccount = (state: RootState) => state.account
export default reducer
