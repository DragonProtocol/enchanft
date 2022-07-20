/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-08 16:34:23
 * @Description: 个人信息
 */
import React, { useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'

const CallBack: React.FC = () => {
  useEffect(() => {
    const code = location.hash.match(/code=([^&]*)/)?.[1]
    const type = location.hash.match(/type=([^&]*)/)?.[1] || 'TWITTER'
    const verifyData = { code: code, type: type }
    localStorage.setItem('account-verify-data',verifyData.toString())
    window.close()
  }, [])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <CircularProgress />
    </Box>
  )
}
export default CallBack