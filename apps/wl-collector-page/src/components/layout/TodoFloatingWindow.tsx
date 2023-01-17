/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 15:11:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-16 15:10:39
 * @Description: file description
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import IconListAlt from '../common/icons/IconListAlt';
import IconClose from '../common/icons/IconClose';
type TodoFloatingWindowProps = {
  count?: number;
};
const TodoFloatingWindow: React.FC<TodoFloatingWindowProps> = ({
  count = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEnter, setIsEnter] = useState(false);
  useEffect(() => {
    if (location.pathname === '/towl') {
      setIsEnter(true);
    } else {
      setIsEnter(false);
    }
  }, [location]);
  const handleEnter = useCallback(() => {
    navigate('/towl');
  }, []);
  const handleLeave = useCallback(() => {
    navigate(-1);
  }, []);

  const handleClick = useCallback(() => {
    if (isEnter) {
      handleLeave();
    } else {
      handleEnter();
    }
  }, [isEnter]);

  return (
    <TodoFloatingWindowWrapper onClick={handleClick}>
      <IconBox>
        {isEnter ? <IconClose size="42px" /> : <IconListAlt size="42px" />}
        {!isEnter && count > 0 && (
          <TodoFloatingWindowCount>{count}</TodoFloatingWindowCount>
        )}
      </IconBox>
    </TodoFloatingWindowWrapper>
  );
};
export default TodoFloatingWindow;

// TodoFloatingWindow style
const TodoFloatingWindowWrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 120px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135.7deg, #ebff00 -4.05%, #3dd606 97.84%);
  border: 4px solid #333333;
  border-right: none;
  /* 左上角和左下角radius */
  border-radius: 20px 0 0 20px;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  cursor: pointer;
  z-index: 2;
`;
const IconBox = styled.div`
  width: auto;
  height: auto;
  position: relative;
`;
// 右上角数量提示
const TodoFloatingWindowCount = styled.div`
  min-width: 24px;
  height: 24px;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  border-radius: 18px;
  box-sizing: border-box;
  background: #d62b06;
  font-weight: 700;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;
