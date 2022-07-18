/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 15:11:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-14 17:24:36
 * @Description: file description
 */
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { selectAccount } from '../../features/user/accountSlice'
import { useAppSelector } from '../../store/hooks'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CloseIcon from '@mui/icons-material/Close'
const TodoFloatingWindow: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAppSelector(selectAccount)
  const [isEnter, setIsEnter] = useState(false)
  useEffect(() => {
    if (location.pathname === '/todo') {
      setIsEnter(true)
    } else {
      setIsEnter(false)
    }
  }, [location])
  const handleEnter = useCallback(() => {
    navigate('/todo')
  }, [])
  const handleLeave = useCallback(() => {
    navigate(-1)
  }, [])
  if (!token) return null

  return (
    <TodoFloatingWindowWrapper>
      {isEnter ? (
        <CloseIcon onClick={handleLeave} sx={{ fontSize: '50px' }} />
      ) : (
        <ListAltIcon onClick={handleEnter} sx={{ fontSize: '50px' }} />
      )}
    </TodoFloatingWindowWrapper>
  )
}
export default TodoFloatingWindow

// TodoFloatingWindow style
const TodoFloatingWindowWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background-color: rgba(21, 21, 21, 100);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  z-index: 2;
`
