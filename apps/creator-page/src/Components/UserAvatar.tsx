/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 13:41:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-17 11:40:57
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import AvatarDefault from './imgs/avatar.png';
type UserAvatarProps = HTMLAttributes<HTMLImageElement> & {
  src?: string;
};
const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  ...otherProps
}: UserAvatarProps) => {
  return <UserAvatarWrapper src={src || AvatarDefault} {...otherProps} />;
};
export default UserAvatar;
const UserAvatarWrapper = styled.img`
  border-radius: 4px;
  object-fit: cover;
`;
