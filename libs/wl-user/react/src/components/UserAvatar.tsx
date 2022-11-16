/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 14:18:48
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import multiavatar from '@multiavatar/multiavatar';
import AvatarDefault from './imgs/avatar.png';
import { useWlUserReact } from '../provider';
import { User } from '../api';
type UserAvatarProps = HTMLAttributes<HTMLImageElement> & {
  src?: string;
  user?: Pick<User, 'id' | 'avatar'>;
};
const getUserAvatarSrc = (user: Pick<User, 'id' | 'avatar'>) => {
  return (
    user.avatar ||
    'data:image/svg+xml;utf-8,' +
      encodeURIComponent(multiavatar(`wl_user_` + user.id))
  );
};
const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  user,
  ...otherProps
}: UserAvatarProps) => {
  const { user: loginUser } = useWlUserReact();
  return (
    <UserAvatarWrapper
      src={src || getUserAvatarSrc(user || loginUser)}
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
