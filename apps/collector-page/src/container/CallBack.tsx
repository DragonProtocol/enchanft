/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-20 15:25:08
 * @Description: 个人信息
 */
import React, { useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'

const CallBack: React.FC = () => {
  useEffect(() => {
    // TODO: 已加入单页面，可以废弃
    // localStorage.setItem('social_auth', JSON.stringify({ code: 'asdjhahd', type: 'Twitter' }))
    // const code = location.hash.match(/code=([^&]*)/)?.[1]
    // const type = location.hash.match(/type=([^&]*)/)?.[1] || 'TWITTER'
    // localStorage.setItem('account-verify-data', JSON.stringify({ code: code, type: type }))
    // window.close()
  }, [])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <CircularProgress />
    </Box>
  )
}
export default CallBack
