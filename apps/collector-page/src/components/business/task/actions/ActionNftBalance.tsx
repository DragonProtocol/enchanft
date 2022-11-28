/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-14 14:09:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-26 18:19:22
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { UserActionStatus } from '../../../../types/api';
import { TaskActionItemDataType } from '../TaskActionItem';
import ActionIconBox from './ActionIconBox';
import ActionNameSpan from './ActionNameSpan';
import { NftInfo } from '../../../../types/entities';
import IconWL from '../../../common/icons/IconWL';
import { getNftCollectionUrl } from '../../../../utils/nft';

export type ActionNftBalanceProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
};

const ActionNftBalance: React.FC<ActionNftBalanceProps> = ({
  data,
  allowHandle,
}: ActionNftBalanceProps) => {
  const {
    name,
    orderNum,
    type,
    taskId,
    projectId,
    communityId,
    description,
    data: actionData,
    status,
  } = data;
  const isDone = status === UserActionStatus.DONE;
  const accounts = actionData?.nft_accounts || [];
  const clickAction = (nft: NftInfo) => {
    if (!allowHandle || isDone) return;
    const winParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
      width=1000,height=1000,left=0,top=0`;
    window.open(nft.url || getNftCollectionUrl(nft.address), name, winParams);
  };
  return (
    <ActionNftBalanceWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <IconWL opacity={isDone ? 0.5 : 1} />
      </ActionIconBox>
      <ActionContentBox>
        <ActionTitle allowHandle={allowHandle} isDone={isDone}>
          Holding {accounts.length > 2 && ' one of '}
          {accounts.map((item, index) => (
            <ActionLinkBox key={index}>
              {accounts.length > 1 &&
                (index === accounts.length - 1
                  ? ' or '
                  : index > 0
                  ? ' 、'
                  : '')}
              <ActionLink onClick={() => clickAction(item)}>
                {item.name}
              </ActionLink>
            </ActionLinkBox>
          ))}{' '}
          NFT
        </ActionTitle>
      </ActionContentBox>
    </ActionNftBalanceWrapper>
  );
};
export default ActionNftBalance;
const ActionNftBalanceWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
`;
const ActionTitle = styled(ActionNameSpan)`
  cursor: auto;
  /* 鼠标浮上加下划线 */
  &:hover {
    text-decoration-line: none;
  }
  /* 鼠标点下整体变绿色 */
  &:active {
    color: inherit;
  }
`;
const ActionLinkBox = styled.span``;
const ActionLink = styled.a`
  cursor: pointer;
  &:hover {
    /* color: #4c91f0; */
    text-decoration-line: underline;
  }
  /* 鼠标点下整体变绿色 */
  &:active {
    color: #3dd606;
  }
`;
