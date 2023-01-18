/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 21:58:44
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import ProjectImgDefault from '../project/ProjectImgDefault';

export type DappSideBarListItemData = ProjectExploreListItemResponse;
export type DappSideBarListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: DappSideBarListItemData;
  onOpen?: () => void;
};
export default function DappSideBarListItem({
  data,
  onOpen,
  ...props
}: DappSideBarListItemProps) {
  return (
    <ExploreListItemWrapper {...props}>
      <ListItemInner>
        <ItemImg src={data.image} onClick={onOpen} title={data.name} />
      </ListItemInner>
    </ExploreListItemWrapper>
  );
}
const ExploreListItemWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  &:hover {
    & > * {
      transform: scale(1.2);
    }
  }
`;
const ListItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
`;

const ItemImg = styled(ProjectImgDefault)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;
