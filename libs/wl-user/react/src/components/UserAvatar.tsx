/* eslint-disable no-param-reassign */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 14:36:21
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import multiavatar from '@multiavatar/multiavatar';
import AvatarDefault from './imgs/avatar.png';
import { User } from '../api';
import { useWlUserReact } from '../hooks';

type UserAvatarProps = StyledComponentPropsWithRef<'img'> & {
  src?: string;
  user?: Pick<User, 'id' | 'avatar'>;
};
const getUserAvatarSrc = (user: Pick<User, 'id' | 'avatar'>) =>
  user.avatar ||
  `data:image/svg+xml;utf-8,${encodeURIComponent(
    multiavatar(`wl_user_${user.id}`)
  )}`;
function UserAvatar({ src, user, ...otherProps }: UserAvatarProps) {
  const { user: loginUser } = useWlUserReact();
  return (
    <UserAvatarWrapper
      src={src || getUserAvatarSrc(user || loginUser)}
      onError={(el: React.SyntheticEvent<HTMLImageElement, Event>) => {
        el.currentTarget.src = AvatarDefault;
      }}
      {...otherProps}
    />
  );
}
export default UserAvatar;
const UserAvatarWrapper = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
