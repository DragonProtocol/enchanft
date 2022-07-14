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
  const { twitter, errorMsg } = useAppSelector(selectAccount)

  useEffect(() => {
    const code = location.hash.match(/code=([^&]*)/)?.[1]
    // const urlParams = new URLSearchParams(location.search)
    // const code = urlParams.get('code')
    if (code) {
      dispatch(userLink({ code }))
    } else {
      navigate('/profile')
      console.log('link failed: no code found')
    }
  }, [])

  const handleOpener = (path = '/') => {
    if (window) {
      window.close();
      if (window.opener) {
        window.opener.location.href = path;
      }
    }
  }

  useEffect(() => {
    if (twitter) {
      console.log('link scuccess')
      // navigate('/profile')
      handleOpener('/profile')
    } else if (errorMsg) {
      console.log('link failed: no twitter found')
      handleOpener('/profile')
    }
  }, [twitter])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <CircularProgress />
    </Box>
  )
}
export default CallBack
