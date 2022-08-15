/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 15:11:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-15 18:09:38
 * @Description: file description
 */
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close'
import IconListAlt from '../common/icons/IconListAlt'
type TodoFloatingWindowProps = {
  count?: number
}
const TodoFloatingWindow: React.FC<TodoFloatingWindowProps> = ({ count = 0 }) => {
  const navigate = useNavigate()
  const location = useLocation()
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

  return (
    <TodoFloatingWindowWrapper onClick={handleClick}>
      {isEnter ? <CloseIcon sx={{ fontSize: '50px' }} /> : <IconListAlt size="50px" />}
      {!isEnter && count > 0 && <TodoFloatingWindowCount>{count}</TodoFloatingWindowCount>}
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
// 右上角数量提示
const TodoFloatingWindowCount = styled.div`
  min-width: 36px;
  height: 36px;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  border-radius: 18px;
  padding: 10px;
  box-sizing: border-box;
  background: #ff0000;
  color: #fff;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`
