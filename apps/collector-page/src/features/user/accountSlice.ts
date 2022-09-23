/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-23 18:48:58
 * @Description: 用户的账户信息
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'
import { login, updateProfile, link, unlink, getProfile, getTwittierRequestToken } from '../../services/api/login'
import { AsyncRequestStatus } from '../../types'
import {
  DEFAULT_WALLET,
  LAST_LOGIN_AVATAR,
  LAST_LOGIN_NAME,
  LAST_LOGIN_TOKEN,
  LAST_LOGIN_PUBKEY,
  LAST_LOGIN_TYPE,
  setLoginToken,
  TokenType,
} from '../../utils/token'
import { toast } from 'react-toastify'
import { FetchTwitterOauthTokenResponse } from '../../types/api'
import { connectionSocialMedia, SocialMediaType } from '../../utils/socialMedia'
import { AccountType } from '../../types/entities'

export enum ConnectModal {
  PHANTOM = 'phantom',
  METAMASK = 'metamask',
  TWITTER = 'twitter',
  DISCORD = 'discord',
  EMAIL = 'email',
}

type Account = {
  accountType: AccountType
  thirdpartyId: string
  thirdpartyName: string
  data?: unknown
}

export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
}

export enum ResourceType {
  TASK = 'TASK',
  PROJECT = 'PROJECT',
  COMMUNITY = 'COMMUNITY',
}

export type ResourcePermission =
  | { resourceType: ResourceType.TASK; resourceIds: number[] }
  | { resourceType: ResourceType.PROJECT; resourceIds: number[] }
  | { resourceType: ResourceType.COMMUNITY; resourceIds: number[] }

export type AccountState = {
  isLogin: boolean
  status: AsyncRequestStatus
  linkStatus: AsyncRequestStatus
  errorMsg?: string
  defaultWallet: TokenType
  lastLoginType: TokenType | null
  lastLoginInfo: { name: string; avatar: string }
  walletChecked: boolean
  pubkey: string
  lastPubkey: string
  token: string
  avatar: string
  name: string
  id: number
  connectModal: ConnectModal | null
  connectWalletModalShow: boolean
  accounts: Array<Account>
  linkErrMsg: string
  resourcePermissions: Array<ResourcePermission>
  roles: Array<RoleType>
  fetchTwitterOauthToken: {
    status: AsyncRequestStatus
    data?: FetchTwitterOauthTokenResponse
  }
}
const initIslogin = () => {
  const lastLoginType = localStorage.getItem(LAST_LOGIN_TYPE) as TokenType
  if (lastLoginType === TokenType.Twitter) {
    return !!localStorage.getItem(LAST_LOGIN_TOKEN)
  } else {
    return !!localStorage.getItem(LAST_LOGIN_PUBKEY) && !!localStorage.getItem(LAST_LOGIN_TOKEN)
  }
}
// 用户账户信息
const initialState: AccountState = {
  isLogin: initIslogin(),
  status: AsyncRequestStatus.IDLE,
  linkStatus: AsyncRequestStatus.IDLE,
  defaultWallet: (localStorage.getItem(DEFAULT_WALLET) as TokenType) || '',
  lastLoginType: (localStorage.getItem(LAST_LOGIN_TYPE) as TokenType) || '',
  lastLoginInfo: {
    name: localStorage.getItem(LAST_LOGIN_NAME) || '',
    avatar: localStorage.getItem(LAST_LOGIN_AVATAR) || '',
  },
  walletChecked: false,
  pubkey: localStorage.getItem(LAST_LOGIN_PUBKEY) || '',
  lastPubkey: localStorage.getItem(LAST_LOGIN_PUBKEY) || '',
  token: localStorage.getItem(LAST_LOGIN_TOKEN) || '',
  avatar: localStorage.getItem(LAST_LOGIN_AVATAR) || '',
  name: localStorage.getItem(LAST_LOGIN_NAME) || '',
  id: 0,
  connectModal: null,
  connectWalletModalShow: false,
  accounts: [],
  resourcePermissions: [],
  roles: [],
  linkErrMsg: '',
  fetchTwitterOauthToken: {
    status: AsyncRequestStatus.IDLE,
    data: {
      oauthToken: '',
      oauthTokenSecret: '',
    },
  },
}
const AccountTypeAdapter = {
  [TokenType.Ethereum]: AccountType.EVM,
  [TokenType.Solana]: AccountType.SOLANA,
  [TokenType.Twitter]: AccountType.TWITTER,
}
export const userLogin = createAsyncThunk(
  'user/login',
  async ({
    signature,
    payload,
    pubkey,
    walletType,
    twitterOauthToken,
    twitterOauthVerifier,
  }: {
    signature?: string
    payload?: string
    pubkey?: string
    walletType: TokenType
    twitterOauthToken?: string
    twitterOauthVerifier?: string
  }) => {
    const resp = await login({
      signature,
      payload,
      pubkey,
      type: AccountTypeAdapter[walletType],
      twitterOauthToken,
      twitterOauthVerifier,
    })
    return {
      ...resp.data,
      pubkey,
      walletType,
    }
  },
)

export const userGetProfile = createAsyncThunk('user/getProfile', async () => {
  const resp = await getProfile()
  return resp.data
})

export const userUpdateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ avatar, name, pubkey }: { avatar: string; name: string; pubkey: string }, thunkAPI) => {
    const resp = await updateProfile({
      userAvatar: avatar,
      userName: name,
      pubkey,
    })
    thunkAPI.dispatch(setAvatar(avatar))
    thunkAPI.dispatch(setName(name))
    thunkAPI.dispatch(setLastLoginInfo({ name, avatar }))
    return resp.data
  },
)

export const userLink = createAsyncThunk(
  'user/userLink',
  async ({ code, type }: { code: string; type: string }, thunkAPI) => {
    const resp = await link({
      code,
      type,
    })

    return resp.data
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        account: { linkStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (linkStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const userUnlink = createAsyncThunk(
  'user/userUnlink',
  async ({ type }: { type: string }, thunkAPI) => {
    const resp = await unlink({
      type,
    })
    return resp.data
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        account: { linkStatus },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (linkStatus === AsyncRequestStatus.PENDING) {
        return false
      }
      return true
    },
  },
)

export const userOtherWalletLink = createAsyncThunk(
  'user/otherWalletLink',
  async (
    {
      walletType,
      signature,
      payload,
      pubkey,
      token,
    }: {
      walletType: TokenType
      signature: string
      payload: string
      pubkey: string
      token?: string
    },
    thunkAPI,
  ) => {
    const account = (thunkAPI.getState() as RootState).account
    try {
      const resp = await link({
        type: AccountTypeAdapter[walletType],
        signature,
        payload,
        pubkey,
        token: token || account.token,
      })
      return { accounts: resp.data, walletType }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw error
      }
    }
  },
)

export const fetchTwitterOauthToken = createAsyncThunk(
  'user/fetchTwitterOauthToken',
  async () => {
    const resp = await getTwittierRequestToken()
    if (resp.data.code === 0) {
      return resp.data.data
    } else {
      throw new Error(resp.data.msg)
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState
      const {
        account: { fetchTwitterOauthToken },
      } = state
      // 之前的请求正在进行中,则阻止新的请求
      if (fetchTwitterOauthToken.status === AsyncRequestStatus.PENDING) {
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
    resetLoginStatus: (state) => {
      state.status = initialState.status
    },
    setWalletChecked: (state) => {
      state.walletChecked = true
    },
    setLastLogin: (state, action) => {
      state.lastLoginType = action.payload
    },
    setLastLoginInfo: (state, action) => {
      state.lastLoginInfo = action.payload
      localStorage.setItem(LAST_LOGIN_AVATAR, action.payload.avatar || '')
      localStorage.setItem(LAST_LOGIN_NAME, action.payload.name || '')
    },
    setConnectModal: (state, action) => {
      state.connectModal = action.payload
    },
    setConnectWalletModalShow: (state, action) => {
      state.connectWalletModalShow = action.payload
    },
    setDefaultWallet: (state, action) => {
      state.defaultWallet = action.payload
      localStorage.setItem(DEFAULT_WALLET, action.payload)
      localStorage.setItem(LAST_LOGIN_TYPE, action.payload)
    },
    setToken: (state, action) => {
      state.token = action.payload
      if (!action.payload) {
        state.accounts = []
        state.resourcePermissions = []
        state.roles = []
      }
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload
    },
    setPubkey: (state, action) => {
      localStorage.setItem(LAST_LOGIN_PUBKEY, action.payload)
      state.pubkey = action.payload
    },
    removeToken: (state) => {
      state.token = ''
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        setLoginToken(action.payload.walletType, action.payload.token, action.payload.pubkey)
        state.status = AsyncRequestStatus.FULFILLED
        state.pubkey = action.payload.pubkey
        state.token = action.payload.token
        state.avatar = action.payload.avatar
        state.name = action.payload.name
        state.id = action.payload.id
        state.accounts = action.payload.accounts
        state.resourcePermissions = action.payload.resourcePermissions
        state.roles = action.payload.roles
        state.defaultWallet = action.payload.walletType
        state.errorMsg = ''
        state.isLogin = true
        localStorage.setItem(LAST_LOGIN_AVATAR, action.payload.avatar || '')
        localStorage.setItem(LAST_LOGIN_NAME, action.payload.name || '')
        localStorage.setItem(LAST_LOGIN_TOKEN, action.payload.token || '')

        localStorage.setItem(DEFAULT_WALLET, action.payload.walletType)
        localStorage.setItem(LAST_LOGIN_TYPE, action.payload.walletType)
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
        toast.error(action.error.message)
      })
      ///////
      .addCase(userLink.pending, (state) => {
        state.linkStatus = AsyncRequestStatus.PENDING
      })
      .addCase(userLink.fulfilled, (state, action) => {
        state.linkStatus = AsyncRequestStatus.FULFILLED
        state.accounts = action.payload || []
        console.log('link successfully: ', state, action)
        toast.success('link ' + action.meta.arg.type + ' successfully!')
      })
      .addCase(userLink.rejected, (state, action) => {
        state.linkStatus = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
        console.log('link failed: ', state, action)
        toast.error(action.error.message)
      })
      ///////
      .addCase(userUnlink.fulfilled, (state, action) => {
        state.accounts = action.payload || []
        toast.success('unlink ' + action.meta.arg.type + ' successfully!')
      })
      .addCase(userUnlink.rejected, (state, action) => {
        console.log('unlink failed: ', state, action)
        toast.error(action.error.message)
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
      ///
      .addCase(userGetProfile.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userGetProfile.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
        state.avatar = action.payload.data.avatar
        state.name = action.payload.data.name
        state.id = action.payload.data.id
        state.accounts = action.payload.data.accounts
        state.resourcePermissions = action.payload.data.resourcePermissions
        state.roles = action.payload.data.roles
        state.errorMsg = ''
        state.isLogin = true
        localStorage.setItem(LAST_LOGIN_AVATAR, action.payload.data.avatar || '')
        localStorage.setItem(LAST_LOGIN_NAME, action.payload.data.name || '')
      })
      .addCase(userGetProfile.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
      })
      ///
      .addCase(userOtherWalletLink.pending, (state) => {
        state.linkStatus = AsyncRequestStatus.PENDING
      })
      .addCase(userOtherWalletLink.fulfilled, (state, action) => {
        state.linkStatus = AsyncRequestStatus.FULFILLED
        state.accounts = action.payload.accounts || []

        toast.success('link ' + action.payload.walletType + ' wallet successfully!')
      })
      .addCase(userOtherWalletLink.rejected, (state, action) => {
        state.linkStatus = AsyncRequestStatus.REJECTED
        toast.error(action.error.message)
      })
      ///
      .addCase(fetchTwitterOauthToken.pending, (state) => {
        state.fetchTwitterOauthToken = {
          status: AsyncRequestStatus.PENDING,
          data: initialState.fetchTwitterOauthToken.data,
        }
      })
      .addCase(fetchTwitterOauthToken.fulfilled, (state, action) => {
        state.fetchTwitterOauthToken = {
          status: AsyncRequestStatus.FULFILLED,
          data: action.payload,
        }
        connectionSocialMedia(SocialMediaType.TWITTER_OAUTH_AUTHENTICATE, action.payload)
      })
      .addCase(fetchTwitterOauthToken.rejected, (state, action) => {
        state.fetchTwitterOauthToken = {
          status: AsyncRequestStatus.REJECTED,
          data: initialState.fetchTwitterOauthToken.data,
        }
        toast.error(action.error.message)
      })
  },
})

const { actions, reducer } = accountSlice
export const {
  setConnectWalletModalShow,
  setConnectModal,
  setDefaultWallet,
  setToken,
  resetLoginStatus,
  setWalletChecked,
  setPubkey,
  setAvatar,
  removeToken,
  setName,
  setLastLogin,
  setLastLoginInfo,
  setIsLogin,
} = actions
export const selectAccount = (state: RootState) => state.account
export default reducer
