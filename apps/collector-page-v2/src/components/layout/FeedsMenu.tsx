/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 17:10:38
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
  rightEl?: ReactNode;
  bottomEl?: ReactNode;
};
export default function FeedsMenu({ rightEl, bottomEl }: FeedsMenuProps) {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();

  return (
    <FeedsMenuWrapper>
      <TopBox>
        <TabSwitch
          options={FeedsSwitchOptions}
          value={firstRouteMeta.key}
          onChange={(value) => navigate(getRoute(value).path)}
        />
        {rightEl && <RightBox>{rightEl}</RightBox>}
      </TopBox>
      {bottomEl}
    </FeedsMenuWrapper>
  );
}
const FeedsMenuWrapper = styled.div`
  width: 100%;
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
  height: 72px;
`;
const RightBox = styled.div`
  flex: 1;
`;
