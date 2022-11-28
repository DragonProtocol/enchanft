/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-25 15:33:48
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-15 13:00:18
 * @Description: file description
 */
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { UserActionStatus } from '../../../../types/api';
import { TaskActionItemDataType } from '../TaskActionItem';
import TooltipWrapper from '../../../common/tooltip/TooltipWrapper';
import IconImage from '../../../common/icons/IconImage';
import ActionIconBox from './ActionIconBox';
import ActionNameSpan from './ActionNameSpan';
import UploadImage from '../../upload/UploadImage';
import { toast } from 'react-toastify';
export type ActionUploadImageProps = {
  data: TaskActionItemDataType;
  allowHandle?: boolean;
  onUploadImage?: (action: TaskActionItemDataType, url: string) => void;
};
const ActionUploadImage: React.FC<ActionUploadImageProps> = ({
  data,
  allowHandle,
  onUploadImage,
}: ActionUploadImageProps) => {
  const {
    name,
    progress,
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
  const isWaitReview = !!actionData?.answer && !actionData?.nopassReason;
  return (
    <ActionUploadImageWrapper>
      <ActionIconBox allowHandle={allowHandle} isDone={isDone}>
        <TooltipWrapper title={description}>
          <IconImage
            width="1.2rem"
            height="1.2rem"
            opacity={isDone ? 0.5 : 1}
          />
        </TooltipWrapper>
      </ActionIconBox>
      <ActionContentBox>
        <ActionNameSpan allowHandle={allowHandle} isDone={isDone}>
          {name}{' '}
          {progress && progress != '' && (
            <ProgressSpan>({progress})</ProgressSpan>
          )}
        </ActionNameSpan>
        {allowHandle && !isDone ? (
          <>
            <UploadImage
              disabled={isWaitReview}
              description={description}
              onSuccess={(url) => onUploadImage && onUploadImage(data, url)}
              onError={(error) => toast.error(error.message)}
              url={actionData?.answer || ''}
            />
            <ConfirmErrorText>
              {isWaitReview ? 'Wait for review' : actionData?.nopassReason}
            </ConfirmErrorText>
          </>
        ) : (
          <UploadImage disabled={true} url={actionData?.answer || ''} />
        )}
      </ActionContentBox>
    </ActionUploadImageWrapper>
  );
};
export default ActionUploadImage;
const ActionUploadImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;
const ActionContentBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ProgressSpan = styled.span`
  color: rgba(51, 51, 51, 0.5);
`;
const ConfirmErrorText = styled.p`
  color: #d60606;
  margin: 0;
`;
