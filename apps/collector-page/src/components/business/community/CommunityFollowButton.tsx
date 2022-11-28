/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-06 17:34:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 15:16:02
 * @Description: file description
 */
import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonProps,
  ButtonWarning,
} from '../../common/button/ButtonBase';
export enum FollowStatusType {
  ACCOUNT_OPERATION = 'ACCOUNT_OPERATION',
  FOLLOW = 'FOLLOW',
  FOLLOWING = 'FOLLOWING',
  FOLLOWED = 'FOLLOWED',
  UNKNOWN = 'UNKNOWN',
}

const followBtnTextMap = {
  [FollowStatusType.ACCOUNT_OPERATION]: 'Apply for WL',
  [FollowStatusType.FOLLOW]: 'Apply for WL',
  [FollowStatusType.FOLLOWING]: 'Loading ...',
  [FollowStatusType.FOLLOWED]: 'Applied',
  [FollowStatusType.UNKNOWN]: 'Unknown Status',
};

export type CommunityFollowButtonViewConfigType = {
  followStatusType?: FollowStatusType;
  followBtnText?: string;
};

export type CommunityFollowButtonHandlesType = {
  onFollow?: () => void;
  onAccountOperation?: () => void;
};
export type CommunityFollowButtonProps = ButtonProps &
  CommunityFollowButtonViewConfigType &
  CommunityFollowButtonHandlesType;

const CommunityFollowButton: React.FC<CommunityFollowButtonProps> = ({
  followStatusType = FollowStatusType.UNKNOWN,
  followBtnText,
  onFollow,
  onAccountOperation,
  ...buttonProps
}: CommunityFollowButtonProps) => {
  const handleFollow = () => {
    if (onFollow) {
      onFollow();
    }
  };
  const handleAccountOperation = () => {
    if (onAccountOperation) {
      onAccountOperation();
    }
  };
  const _followBtnText = followBtnText || followBtnTextMap[followStatusType];
  switch (followStatusType) {
    case FollowStatusType.ACCOUNT_OPERATION:
      return (
        <FollowBtn onClick={handleAccountOperation} {...buttonProps}>
          {_followBtnText}
        </FollowBtn>
        // <WalletBtn onClick={handleAccountOperation} {...buttonProps}>
        //   {_followBtnText}
        // </WalletBtn>
      );
    case FollowStatusType.FOLLOW:
      return (
        <FollowBtn onClick={handleFollow} {...buttonProps}>
          {_followBtnText}
        </FollowBtn>
      );
    case FollowStatusType.FOLLOWING:
    case FollowStatusType.FOLLOWED:
    default:
      return (
        <FollowBtn disabled {...buttonProps}>
          {_followBtnText}
        </FollowBtn>
      );
  }
};
export default CommunityFollowButton;
const FollowBtn = styled(ButtonWarning)`
  font-weight: 700;
  font-size: 18px;
`;
const WalletBtn = styled(ButtonPrimary)`
  font-weight: 700;
  font-size: 18px;
`;
