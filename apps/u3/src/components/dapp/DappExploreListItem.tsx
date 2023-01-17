/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 14:44:01
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import ProjectImgDefault from '../project/ProjectImgDefault';

export type DappExploreListItemData = ProjectExploreListItemResponse;
export type DappExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemData;
  disabledInstall?: boolean;
  loadingInstall?: boolean;
  isInstalled?: boolean;
  onInstall?: () => void;
  onOpen?: () => void;
};
export default function DappExploreListItem({
  data,
  disabledInstall,
  loadingInstall,
  isInstalled,
  onInstall,
  onOpen,
  ...props
}: DappExploreListItemProps) {
  return (
    <ExploreListItemWrapper {...props}>
      <ListItemInner>
        <ItemImg src={data.image} />
        <InnerCenter>
          <ItemName>{data.name}</ItemName>
          <InnerDesc>{data.description}</InnerDesc>
        </InnerCenter>
        {isInstalled ? (
          <OpenButton onClick={onOpen} />
        ) : (
          <InstallButton disabled={disabledInstall} onClick={onInstall}>
            {loadingInstall ? 'Installing ...' : 'Install'}
          </InstallButton>
        )}
      </ListItemInner>
    </ExploreListItemWrapper>
  );
}
const ExploreListItemWrapper = styled.div`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;
const InnerCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`;
const ItemName = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const InnerDesc = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #718096;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InstallButton = styled(ButtonPrimary)`
  width: 74px;
  height: 32px;
`;
const OpenButton = styled(ButtonPrimaryLine)`
  width: 74px;
  height: 32px;
  background: #14171a;
`;
