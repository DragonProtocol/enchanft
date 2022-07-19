/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-08 16:34:23
 * @Description: 个人信息
 */
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectAccount, userLink } from '../features/user/accountSlice'

import { Box, CircularProgress } from '@mui/material'
// import { useHistory } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const CallBack: React.FC = (props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { twitter, discord, errorMsg } = useAppSelector(selectAccount)

  useEffect(() => {
    const code = location.hash.match(/code=([^&]*)/)?.[1]
    const type = location.hash.match(/type=([^&]*)/)?.[1] || 'TWITTER'
    // const urlParams = new URLSearchParams(location.search)
    // const code = urlParams.get('code')
    if (code) {
      dispatch(userLink({ code, type }))
    } else {
      handleClose()
    }
  }, [])

  const handleClose = () => {
    window.close()
    localStorage.setItem('account-window', 'close')
  }

  useEffect(() => {
    if (twitter || discord) {
      handleClose()
      // window.opener.postMessage(
      //   {
      //     target: 'third-link',
      //     data: {
      //       twitter,
      //       discord
      //     },
      //   },
      //   'https://launch.enchanft.xyz',
      // ) // pro origin
    } else if (errorMsg) {
      console.log('link failed: no twitter found')
      handleClose()
    }
  }, [twitter, discord])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <CircularProgress />
    </Box>
  )
}
export default CallBack
