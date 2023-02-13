/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-13 11:25:59
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { animated, useTransition } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import useRoute from '../../route/useRoute';
import { RouteKey } from '../../route/routes';
import useUserFavorites from '../../hooks/useUserFavorites';
import DappSideBarListItem from './DappSideBarListItem';
import useDappWebsite from '../../hooks/useDappWebsite';
import DappWebsiteModal from './DappWebsiteModal';
import useProjectHandles from '../../hooks/useProjectHandles';
import InfoCircleSvgUrl from '../common/icons/svgs/info-circle.svg';
import TrashSvgUrl from '../common/icons/svgs/trash.svg';

export default function DappsSideBarList() {
  const navigate = useNavigate();
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

  const { onUnfavor, favorQueueIds } = useProjectHandles();
  const [handlesItemId, setHandlesItemId] = useState<string | number | null>(
    null
  );
  const handlesItem = showProjects.find(
    (item) => handlesItemId && item.id === handlesItemId
  );

  /**
   * 列表项中的操作选项框逻辑
   */
  // 存储列表项对应的dom元素
  const itemElsWeakMap = useRef(new WeakMap());
  // 操作框dom元素
  const handlesPopperEl = useRef<HTMLElement | null>(null);
  // 更新操作框元素的距离
  const updatePopperStyle = () => {
    if (handlesItem && itemElsWeakMap.current.has(handlesItem)) {
      const itemEl = itemElsWeakMap.current.get(handlesItem);
      const contentRect = (itemEl as HTMLElement).getBoundingClientRect();
      const { bottom, height } = contentRect;
      const { offsetHeight } = handlesPopperEl.current;
      const top = bottom - height / 2 - offsetHeight / 2;
      handlesPopperEl.current.style.top = `${top}px`;
    }
  };
  useEffect(() => {
    if (handlesPopperEl.current) {
      handlesPopperEl.current.style.display = handlesItem ? 'flex' : 'none';
      updatePopperStyle();
    }
  }, [handlesItem]);
  // 点击其它位置一次操作框
  useEffect(() => {
    const windowClick = (e: Event) => {
      if (
        handlesPopperEl.current &&
        !handlesPopperEl.current.contains(e.target as Node)
      ) {
        setHandlesItemId(null);
      }
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  return (
    <DappsSideBarListWrapper isOpen={isOpen}>
      <DappsSideBarListInner
        onScroll={() => {
          updatePopperStyle();
        }}
      >
        <Title>Your Dapps</Title>
        {transitions((styles, item) => (
          <animated.div style={styles}>
            <DappSideBarListItem
              data={item}
              onOpen={() => openDappModal(item.id)}
              onOpenHandles={() => setHandlesItemId(item.id)}
              disabled={favorQueueIds.includes(item.id)}
              ref={(el) => {
                if (el) {
                  itemElsWeakMap.current.set(item, el);
                }
              }}
            />
          </animated.div>
        ))}
      </DappsSideBarListInner>
      <HandlesPopperBox
        className="handles-pop-box"
        ref={(el) => {
          if (el) {
            handlesPopperEl.current = el;
          }
        }}
      >
        <HandlesPopperInner>
          <OptionItem
            onClick={() => {
              if (handlesItem) {
                navigate(`/dapps/${handlesItem.id}`);
                setHandlesItemId(null);
              }
            }}
          >
            <OptionIcon src={InfoCircleSvgUrl} />
            <OptionLabel>Dapp Info</OptionLabel>
          </OptionItem>
          <OptionItem
            onClick={() => {
              if (handlesItem) {
                onUnfavor(handlesItem);
                setHandlesItemId(null);
              }
            }}
          >
            <OptionIcon src={TrashSvgUrl} />
            <OptionLabel>Uninstall</OptionLabel>
          </OptionItem>
        </HandlesPopperInner>
        <HandlesPopperArrow />
      </HandlesPopperBox>
      <DappWebsiteModal />
    </DappsSideBarListWrapper>
  );
}
const DappsSideBarListWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '60px' : '0px')};
  height: 100%;
  z-index: 1;
  transition: all 0.3s ease-out;
  position: relative;
`;
const DappsSideBarListInner = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  border-left: 1px solid #39424c;
  box-sizing: border-box;
  overflow-y: scroll;
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

const HandlesPopperBox = styled.div`
  z-index: 2;
  position: absolute;
  right: 100%;
  display: flex;
  align-items: center;
`;
const HandlesPopperInner = styled.div`
  width: 172px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
`;
const HandlesPopperArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #39424c;
  transform: translateX(-5px) rotate(90deg);
  margin-right: -10px;
`;
const OptionItem = styled.div<{ isActive?: boolean }>`
  height: 60px;
  padding: 20px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background: ${(props) => (props.isActive ? '#14171A' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isActive &&
      `
        background: #14171a;
        color: #FFFFFF;
      `};
  }
`;
const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span`
  white-space: nowrap;
`;
