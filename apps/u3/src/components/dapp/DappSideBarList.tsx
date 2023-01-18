/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 13:10:22
 * @Description: file description
 */
import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { animated, useTransition } from '@react-spring/web';
import useLogin from '../../hooks/useLogin';
import useRoute from '../../route/useRoute';
import { RouteKey } from '../../route/routes';
import useUserFavorites from '../../hooks/useUserFavorites';
import DappSideBarListItem from './DappSideBarListItem';
import useDappWebsite from '../../hooks/useDappWebsite';
import DappWebsiteModal from './DappWebsiteModal';

export default function DappsSideBarList() {
  const { openDappModal } = useDappWebsite();
  const { projects } = useUserFavorites();
  const { isLogin } = useLogin();
  const { firstRouteMeta } = useRoute();
  const isOpen = useMemo(() => {
    return (
      isLogin && [RouteKey.dapps, RouteKey.dapp].includes(firstRouteMeta.key)
    );
  }, [isLogin, firstRouteMeta]);
  const showProjects = useMemo(() => [...projects].reverse(), [projects]);
  const transitions = useTransition(showProjects, {
    keys: (item) => item.id,
    from: {
      opacity: 0,
      transform: 'scale(0)',
    },
    enter: {
      opacity: 1,
      transform: 'scale(1)',
    },
    leave: {
      opacity: 0,
      transform: 'scale(0)',
    },
    // trail: 200,
    config: {
      duration: 500,
      mass: 5,
      tension: 500,
      friction: 100,
    },
  });

  return (
    <>
      <DappsSideBarListWrapper isOpen={isOpen}>
        <DappsSideBarListInner>
          <Title>Your Dapps</Title>
          {transitions((styles, item) => (
            <animated.div style={styles}>
              <DappSideBarListItem
                data={item}
                onOpen={() => openDappModal(item.id)}
              />
            </animated.div>
          ))}
        </DappsSideBarListInner>
      </DappsSideBarListWrapper>
      <DappWebsiteModal />
    </>
  );
}
const DappsSideBarListWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '60px' : '0px')};
  height: 100%;
  z-index: 1;
  overflow: auto;
  transition: all 0.3s ease-out;
`;
const DappsSideBarListInner = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  border-left: 1px solid #39424c;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
`;
const Title = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #718096;
`;
