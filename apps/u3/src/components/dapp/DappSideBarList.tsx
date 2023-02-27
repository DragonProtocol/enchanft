/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-17 11:54:26
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { animated, useTransition, useSprings } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import { useDrag } from 'react-use-gesture';
import { clamp } from 'lodash';
import swap from 'lodash-move';
import useLogin from '../../hooks/useLogin';
import useRoute from '../../route/useRoute';
import { RouteKey } from '../../route/routes';
import useUserFavorites from '../../hooks/useUserFavorites';
import DappSideBarListItem from './DappSideBarListItem';
import useDappWebsite from '../../hooks/useDappWebsite';
import DappWebsiteModal from './DappWebsiteModal';
import useDappHandles from '../../hooks/useDappHandles';
import InfoCircleSvgUrl from '../common/icons/svgs/info-circle.svg';
import TrashSvgUrl from '../common/icons/svgs/trash.svg';
import {
  getDappSideBarOrderForStore,
  setDappSideBarOrderToStore,
} from '../../utils/dapp';

const dragFn =
  (orders: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 76 + y,
          scale: 1.1,
          zIndex: 1,
          immediate: (key: string) => key === 'y' || key === 'zIndex',
        }
      : {
          y: orders.indexOf(index) * 76,
          scale: 1,
          zIndex: 0,
          immediate: false,
        };

export default function DappsSideBarList() {
  const navigate = useNavigate();
  const { openDappModal } = useDappWebsite();
  const { dapps } = useUserFavorites();
  const { isLogin } = useLogin();
  const { firstRouteMeta } = useRoute();
  const isOpen = useMemo(() => {
    return (
      isLogin && [RouteKey.dapps, RouteKey.dapp].includes(firstRouteMeta.key)
    );
  }, [isLogin, firstRouteMeta]);

  // const showDapps = useMemo(
  //   () =>
  //     [...dapps].sort(
  //       (a, b) => order.current?.indexOf(a.id) - order.current?.indexOf(b.id)
  //     ),
  //   [dapps]
  // );
  // const transitions = useTransition(showDapps, {
  //   keys: (item) => item.id,
  //   from: {
  //     opacity: 0,
  //     transform: 'scale(0)',
  //   },
  //   enter: {
  //     opacity: 1,
  //     transform: 'scale(1)',
  //   },
  //   leave: {
  //     opacity: 0,
  //     transform: 'scale(0)',
  //   },
  //   // trail: 200,
  //   config: {
  //     duration: 500,
  //     mass: 5,
  //     tension: 500,
  //     friction: 100,
  //   },
  // });

  const { onUnfavor, favorQueueIds } = useDappHandles();
  const [handlesItemId, setHandlesItemId] = useState<string | number | null>(
    null
  );
  const handlesItem = dapps.find(
    (item) => handlesItemId && item.id === handlesItemId
  );

  /**
   * 列表项中的操作选项框跟随列表项的位置移动
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
  // 点击其它位置隐藏操作框
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

  /**
   * 列表项拖拽排序
   */
  const orderStore = useRef(getDappSideBarOrderForStore());
  const order = useRef<Array<number>>([]);

  const [springs, api] = useSprings(dapps.length, dragFn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  useEffect(() => {
    const newOrder = dapps
      .map((item, i) => ({ ...item, originIndex: i }))
      .sort(
        (a, b) =>
          orderStore.current.indexOf(a.id) - orderStore.current.indexOf(b.id)
      )
      .map((item) => item.originIndex);
    if (newOrder.length !== order.current.length) {
      api.start(dragFn(newOrder));
    }
    order.current = [...newOrder];
  }, [dapps]);

  const bind = useDrag(
    ({ args: [originalIndex], active, movement: [, y] }) => {
      const curIndex = order.current?.indexOf(originalIndex);
      const curRow = clamp(
        Math.round((curIndex * 76 + y) / 76),
        0,
        dapps.length - 1
      );
      const newOrder = swap(order.current, curIndex, curRow);
      api.start(dragFn(newOrder, active, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
      setHandlesItemId(null);
      if (!active) {
        order.current = newOrder;
        const newOrderStore = [
          ...new Set(order.current?.map((i: string | number) => dapps[i]?.id)),
        ];
        orderStore.current = newOrderStore;
        setDappSideBarOrderToStore(newOrderStore);
      }
    },
    {
      preventDefault: true,
      filterTaps: true,
    }
  );

  return (
    <DappsSideBarListWrapper isOpen={isOpen}>
      <DappsSideBarListInner
        onScroll={() => {
          updatePopperStyle();
        }}
      >
        <Title>Your Dapps</Title>
        <DappList style={{ height: dapps.length * 76 }}>
          {springs.map(({ zIndex, y, scale }, i) => (
            <animated.div
              {...bind(i)}
              key={dapps[i].id}
              style={{
                zIndex,
                y,
                scale,
              }}
            >
              <DappSideBarListItem
                data={dapps[i]}
                onOpen={() => openDappModal(dapps[i].id)}
                onOpenHandles={() => setHandlesItemId(dapps[i].id)}
                disabled={favorQueueIds.includes(dapps[i].id)}
                ref={(el) => {
                  if (el) {
                    itemElsWeakMap.current.set(dapps[i], el);
                  }
                }}
              />
            </animated.div>
          ))}
        </DappList>
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
                const originIndex = dapps.findIndex(
                  (item) => item.id === handlesItem.id
                );
                if (originIndex !== -1) {
                  order.current = [...new Set([originIndex, ...order.current])];
                }

                api.start(dragFn(order.current));
                setHandlesItemId(null);
              }
            }}
          >
            <OptionLabel
              style={{ width: '20px', textAlign: 'center', color: '#718096' }}
            >
              ↑
            </OptionLabel>
            <OptionLabel>Top</OptionLabel>
          </OptionItem>
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
                const newOrderStore = orderStore.current.filter(
                  (id) => handlesItem.id !== id
                );
                orderStore.current = [...newOrderStore];
                setDappSideBarOrderToStore(newOrderStore);
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
const DappList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  position: relative;
  & > div {
    position: absolute;
    width: 100%;
    height: 76px;
    transform-origin: 50% 50% 0px;
  }
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
