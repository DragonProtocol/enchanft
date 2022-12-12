/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 18:17:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 14:34:05
 * @Description: file description
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { submitNavs } from '../../route/nav';
import useRoute from '../../route/useRoute';
import PlusSvg from '../common/icons/svgs/plus.svg';

export default function SubmitNav() {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  const [openNavs, setOpenNavs] = useState(false);
  return (
    <NavWrapper>
      <NavButton onClick={() => setOpenNavs(!openNavs)}>
        <NavButtonIcon src={PlusSvg} />
        <NavButtonText>Submit</NavButtonText>
      </NavButton>

      {openNavs && (
        <NavsBox>
          {submitNavs.map((item) => (
            <NavItem
              key={item.link}
              isActive={item.activeRouteKeys.includes(firstRouteMeta.key)}
              onClick={() => {
                navigate(item.link);
                setOpenNavs(false);
              }}
            >
              {item.name}
            </NavItem>
          ))}
        </NavsBox>
      )}
    </NavWrapper>
  );
}
const NavWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;
const NavButton = styled.div`
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  padding: 12px 24px;
  isolation: isolate;
  height: 48px;
  border: 1px solid #39424c;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const NavButtonIcon = styled.img`
  width: 24px;
  height: 24px;
`;
const NavButtonText = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;
const NavsBox = styled.div`
  position: absolute;
  left: 0;
  bottom: -10px;
  transform: translateY(100%);
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 165px;
  height: 118px;

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 10px;
`;
const NavItem = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 0;
  flex: 1;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  border-radius: 20px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.isActive ? '#14171A' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isActive &&
      `
      background: #14171a;
      opacity: 0.8;
    `};
  }
`;
