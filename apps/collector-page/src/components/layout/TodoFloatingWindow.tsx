/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 15:11:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-12 19:04:27
 * @Description: file description
 */
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { selectAccount } from '../../features/user/accountSlice'
import { useAppSelector } from '../../store/hooks'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CloseIcon from '@mui/icons-material/Close'
import IconListAlt from '../common/icons/IconListAlt'
const TodoFloatingWindow: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAppSelector(selectAccount)
  const [isEnter, setIsEnter] = useState(false)
  useEffect(() => {
    if (location.pathname === '/towl') {
      setIsEnter(true)
    } else {
      setIsEnter(false)
    }
  }, [location])
  const handleEnter = useCallback(() => {
    navigate('/towl')
  }, [])
  const handleLeave = useCallback(() => {
    navigate(-1)
  }, [])

  const handleClick = useCallback(() => {
    if (isEnter) {
      handleLeave()
    } else {
      handleEnter()
    }
  }, [isEnter])

  if (!token) return null

  return (
    <TodoFloatingWindowWrapper onClick={handleClick}>
      {isEnter ? <CloseIcon sx={{ fontSize: '50px' }} /> : <IconListAlt size="50px" />}
    </TodoFloatingWindowWrapper>
  )
}
export default TodoFloatingWindow

// TodoFloatingWindow style
const TodoFloatingWindowWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 40px;
  width: 80px;
  height: 80px;
  background: #e4ffdb;
  border: 4px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  cursor: pointer;
  z-index: 2;
`
