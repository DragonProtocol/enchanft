/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-20 16:13:12
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import multiavatar from '@multiavatar/multiavatar';
import AvatarDefault from './imgs/avatar.png';
type UserAvatarProps = HTMLAttributes<HTMLImageElement> & {
  src?: string;
  multiavatarId?: string;
};
const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  multiavatarId,
  ...otherProps
}: UserAvatarProps) => {
  return (
    <UserAvatarWrapper
      src={
        src ||
        'data:image/svg+xml;utf-8,' +
          encodeURIComponent(multiavatar(multiavatarId || 'user avatar'))
      }
      onError={(el: React.SyntheticEvent<HTMLImageElement, Event>) =>
        (el.currentTarget.src = AvatarDefault)
      }
      {...otherProps}
    />
  );
};
export default UserAvatar;
const UserAvatarWrapper = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
