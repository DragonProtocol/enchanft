/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-01 18:06:08
 * @Description: 用户的账户信息
 */
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'

type AccountState = {
  token: string
}

// 用户账户信息
const initialState: AccountState = {
  token: '',
}

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
  },
})

const { actions, reducer } = accountSlice
export const { setToken, removeToken } = actions
export const selectAccount = (state: RootState) => state.account
export default reducer
