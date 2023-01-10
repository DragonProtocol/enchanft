/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 18:44:50
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getRoute, RouteKey } from '../../route/routes';
import useRoute from '../../route/useRoute';
import Tab from '../common/tab/Tab';
import {
  LayoutGrid,
  LayoutGridActive,
  LayoutList,
  LayoutListActive,
} from '../icons/layout';

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

export enum Layout {
  LIST,
  GRID,
}
export default function FeedsMenu({
  multiLayout,
  layout,
  setLayout,
}: {
  multiLayout?: boolean;
  layout?: Layout;
  setLayout?: (layout: Layout) => void;
}) {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  return (
    <FeedsMenuWrapper>
      <TabSwitch
        options={FeedsSwitchOptions}
        value={firstRouteMeta.key}
        onChange={(value) => navigate(getRoute(value).path)}
      />
      <FilterBox>
        <div className="filter" />
        {multiLayout && (
          <div className="layout">
            <span
              onClick={() => {
                if (setLayout) setLayout(Layout.LIST);
              }}
            >
              {(layout === Layout.LIST && <LayoutListActive />) || (
                <LayoutList />
              )}
            </span>
            <span
              onClick={() => {
                setLayout(Layout.GRID);
              }}
            >
              {(layout === Layout.GRID && <LayoutGridActive />) || (
                <LayoutList />
              )}
            </span>
          </div>
        )}
      </FilterBox>
    </FeedsMenuWrapper>
  );
}
const FeedsMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid #39424c;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
  height: 32px;
`;

const FilterBox = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;

  & .layout {
    display: flex;
    align-items: center;
    gap: 10px;
    > span {
      cursor: pointer;
    }
  }
`;
