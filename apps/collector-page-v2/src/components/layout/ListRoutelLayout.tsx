/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 18:50:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 21:02:43
 * @Description: file description
 */
import { PropsWithChildren, ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

type ListRouteLayoutProps = PropsWithChildren & {
  top?: ReactElement;
};
function ListRouteLayout({ top, children }: ListRouteLayoutProps) {
  return (
    <ListRouteLayoutWrapper>
      {top}
      <ContentBox>
        <ListBox>{children}</ListBox>
        <RouteOutLetBox>
          <Outlet />
        </RouteOutLetBox>
      </ContentBox>
    </ListRouteLayoutWrapper>
  );
}
export default ListRouteLayout;
const ListRouteLayoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ContentBox = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
`;
const ListBox = styled.div`
  flex: 1;
`;
const RouteOutLetBox = styled.div`
  flex: 2;
`;
