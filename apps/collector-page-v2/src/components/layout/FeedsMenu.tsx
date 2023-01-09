/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 11:59:12
 * @Description: file description
 */
import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { getRoute, RouteKey } from '../../route/routes';
import useRoute from '../../route/useRoute';
import Tab from '../common/tab/Tab';

const FeedsSwitchOptions = [
  {
    label: 'Events',
    value: RouteKey.events,
  },
  {
    label: 'Contents',
    value: RouteKey.contents,
  },
  {
    label: 'Projects',
    value: RouteKey.projects,
  },
  {
    label: 'Frens',
    value: RouteKey.frens,
  },
];
type FeedsMenuProps = StyledComponentPropsWithRef<'div'> & {
  right?: ReactNode;
  bottom?: ReactNode;
  displayBottom?: boolean;
};
export default function FeedsMenu({
  right,
  bottom,
  displayBottom,
}: FeedsMenuProps) {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  const bottomInnerRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (bottom && bottomInnerRef) {
      if (displayBottom) {
        bottomInnerRef.current.parentElement.style.height = `${bottomInnerRef.current.offsetHeight}px`;
      } else {
        bottomInnerRef.current.parentElement.style.height = '0px';
      }
    }
  }, [bottom, displayBottom]);
  return (
    <FeedsMenuWrapper>
      <TopBox>
        <TabSwitch
          options={FeedsSwitchOptions}
          value={firstRouteMeta.key}
          onChange={(value) => navigate(getRoute(value).path)}
        />
        {right && <RightBox>{right}</RightBox>}
      </TopBox>
      {bottom && (
        <BottomBox>
          <BottomInner
            ref={(el) => {
              if (el) {
                bottomInnerRef.current = el;
              }
            }}
          >
            {bottom}
          </BottomInner>
        </BottomBox>
      )}
    </FeedsMenuWrapper>
  );
}
const FeedsMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const TopBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  border-bottom: 1px solid #39424c;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
  height: 32px;
  flex-shrink: 0;
`;
const RightBox = styled.div`
  flex: 1;
`;
const BottomBox = styled.div`
  width: 100%;
  transition: all 0.3s;
  overflow: hidden;
`;
const BottomInner = styled.div``;
