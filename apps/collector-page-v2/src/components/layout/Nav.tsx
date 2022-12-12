/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 18:17:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 14:20:32
 * @Description: file description
 */
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { navs } from '../../route/nav';
import useRoute from '../../route/useRoute';

export default function Nav() {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  const [openGroupKeys, setOpenGroupKeys] = useState<Array<string>>([]);
  const handleGroupClick = useCallback(
    (name: string) => {
      if (openGroupKeys.includes(name)) {
        setOpenGroupKeys([...openGroupKeys.filter((item) => item !== name)]);
      } else {
        setOpenGroupKeys([...openGroupKeys, name]);
      }
    },
    [openGroupKeys, setOpenGroupKeys]
  );
  return (
    <NavWrapper>
      {navs.map((item) =>
        item.navs ? (
          <PcNavGroupBox>
            <PcNavItem
              key={item.name}
              isActive={false}
              onClick={() => handleGroupClick(item.name)}
            >
              <PcNavItemIcon src={item.iconUrl} />
              <PcNavItemText>{item.name}</PcNavItemText>
            </PcNavItem>
            {openGroupKeys.includes(item.name) &&
              item.navs.map((nav) => (
                <PcNavItem
                  key={nav.link}
                  isActive={nav.activeRouteKeys.includes(firstRouteMeta.key)}
                  onClick={() => navigate(nav.link)}
                >
                  <PcNavItemIconBox />
                  <PcNavItemText>{nav.name}</PcNavItemText>
                </PcNavItem>
              ))}
          </PcNavGroupBox>
        ) : (
          <PcNavItem
            key={item.link}
            isActive={item.activeRouteKeys.includes(firstRouteMeta.key)}
            onClick={() => navigate(item.link)}
          >
            <PcNavItemIcon src={item.iconUrl} />
            <PcNavItemText>{item.name}</PcNavItemText>
          </PcNavItem>
        )
      )}
    </NavWrapper>
  );
}
const NavWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const PcNavItem = styled.div<{ isActive: boolean }>`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  padding: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
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
const PcNavItemIconBox = styled.div`
  width: 16px;
  height: 16px;
`;
const PcNavItemIcon = styled.img`
  width: 16px;
  height: 16px;
`;
const PcNavItemText = styled.span``;
const PcNavGroupBox = styled.div`
  transition: height 1s;
`;
