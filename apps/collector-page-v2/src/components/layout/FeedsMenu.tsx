/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 17:09:46
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
export default function FeedsMenu() {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  return (
    <FeedsMenuWrapper>
      <TabSwitch
        options={FeedsSwitchOptions}
        value={firstRouteMeta.key}
        onChange={(value) => navigate(getRoute(value).path)}
      />
    </FeedsMenuWrapper>
  );
}
const FeedsMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  border-bottom: 1px solid #39424c;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
`;
