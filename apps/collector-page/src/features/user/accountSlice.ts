/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 12:01:04
 * @Description: 用户的账户信息
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'
import { login, updateProfile, link, getProfile } from '../../services/api/login'
import { AsyncRequestStatus } from '../../types'
import {
  DEFAULT_WALLET,
  LAST_LOGIN_AVATAR,
  LAST_LOGIN_NAME,
  LAST_LOGIN_TYPE,
  setLoginToken,
  TokenType,
} from '../../utils/token'

export enum ConnectModal {
  PHANTOM = 'phantom',
  METAMASK = 'metamask',
  TWITTER = 'twitter',
  DISCORD = 'discord',
  EMAIL = 'email',
}

export enum ChainType {
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
}

type Account = {
  accountType: 'SOLANA' | 'EVM' | any
  thirdpartyId: string
  thirdpartyName: string
}

//this should be a global type for all api response
type ResponseMessage = {
  type: AlertSeverity
  message: string | undefined
}

export enum AlertSeverity {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
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
  status: AsyncRequestStatus
  errorMsg?: string //我不确定这个errorMsg有没有被使用，所以没敢改，如果在外部没有使用，建议统一改成resMessage
  defaultWallet: TokenType
  lastLoginType: TokenType | null
  lastLoginInfo: { name: string; avatar: string }
  pubkey: string
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
  resMessage: ResponseMessage | null
}

// 用户账户信息
const initialState: AccountState = {
  status: AsyncRequestStatus.IDLE,
  defaultWallet: (localStorage.getItem(DEFAULT_WALLET) as TokenType) || '',
  lastLoginType: (localStorage.getItem(LAST_LOGIN_TYPE) as TokenType) || '',
  lastLoginInfo: {
    name: localStorage.getItem(LAST_LOGIN_NAME) || '',
    avatar: localStorage.getItem(LAST_LOGIN_AVATAR) || '',
  },
  pubkey: '',
  token: '',
  avatar: '',
  name: '',
  id: 0,
  connectModal: null,
  connectWalletModalShow: false,
  accounts: [],
  resourcePermissions: [],
  roles: [],
  resMessage: null,
  linkErrMsg: '',
}

export const userLogin = createAsyncThunk(
  'user/login',
  async ({
    signature,
    payload,
    pubkey,
    walletType,
  }: {
    signature: string
    payload: string
    pubkey: string
    walletType: TokenType
  }) => {
    const resp = await login({
      signature,
      payload,
      pubkey,
      type: walletType === TokenType.Solana ? ChainType.SOLANA : ChainType.EVM,
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

export const userOtherWalletLink = createAsyncThunk(
  'user/otherWalletLink',
  async ({
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
  }) => {
    try {
      const resp = await link({
        type: walletType === TokenType.Solana ? ChainType.SOLANA : ChainType.EVM,
        signature,
        payload,
        pubkey,
        token,
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

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setLastLogin: (state, action) => {
      state.lastLoginType = action.payload
    },
    setLastLoginInfo: (state, action) => {
      state.lastLoginInfo = action.payload
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
      state.pubkey = action.payload
    },
    removeToken: (state) => {
      state.token = ''
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    resetResMessage: (state) => {
      state.resMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        setLoginToken(action.payload.token, action.payload.pubkey, action.payload.walletType)
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

        localStorage.setItem(LAST_LOGIN_AVATAR, action.payload.avatar)
        localStorage.setItem(LAST_LOGIN_NAME, action.payload.name)

        localStorage.setItem(DEFAULT_WALLET, action.payload.walletType)
        localStorage.setItem(LAST_LOGIN_TYPE, action.payload.walletType)
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
      })
      ///////
      .addCase(userLink.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userLink.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
        state.accounts = action.payload || []
        console.log('link successfully: ', state, action)
        state.resMessage = {
          type: AlertSeverity.SUCCESS,
          message: 'link ' + action.meta.arg.type + ' successfully!',
        }
      })
      .addCase(userLink.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
        console.log('link failed: ', state, action)
        state.resMessage = {
          type: AlertSeverity.ERROR,
          message: action.error.message,
        }
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

        localStorage.setItem(LAST_LOGIN_AVATAR, action.payload.data.avatar)
        localStorage.setItem(LAST_LOGIN_NAME, action.payload.data.name)
      })
      .addCase(userGetProfile.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED
        state.errorMsg = action.error.message || 'failed'
      })
      ///
      .addCase(userOtherWalletLink.pending, (state) => {
        state.status = AsyncRequestStatus.PENDING
      })
      .addCase(userOtherWalletLink.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED
        state.defaultWallet = action.payload.walletType
        state.accounts = action.payload.accounts || []

        localStorage.setItem(DEFAULT_WALLET, action.payload.walletType)
        localStorage.setItem(LAST_LOGIN_TYPE, action.payload.walletType)

        state.resMessage = {
          type: AlertSeverity.SUCCESS,
          message: 'link ' + action.payload.walletType + ' wallet successfully!',
        }
      })
      .addCase(userOtherWalletLink.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED

        state.resMessage = {
          type: AlertSeverity.ERROR,
          message: action.error.message,
        }
      })
  },
})

const { actions, reducer } = accountSlice
export const {
  setConnectWalletModalShow,
  setConnectModal,
  setDefaultWallet,
  setToken,
  setPubkey,
  setAvatar,
  removeToken,
  setName,
  setLastLogin,
  setLastLoginInfo,
  resetResMessage,
} = actions
export const selectAccount = (state: RootState) => state.account
export default reducer
