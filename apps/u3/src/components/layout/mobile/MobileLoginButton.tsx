/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 16:06:46
 * @Description: file description
 */
import { UserAvatar, getUserDisplayName } from '@ecnft/wl-user-react';
import styled from 'styled-components';
import useLogin from '../../../hooks/useLogin';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import LogoutSvg from '../../common/icons/svgs/logout.svg';

type Props = {
  onLogout?: () => void;
};
export default function MobileLoginButton({ onLogout }: Props) {
  const { authorizer, user, isLogin, login } = useLogin();
  const nameStr = authorizer && getUserDisplayName(user, authorizer);

  return (
    <MobileLoginButtonWrapper
      onClick={() => {
        if (!isLogin) {
          login();
        } else {
          onLogout();
        }
      }}
    >
      <MobileLoginButtonBody className="wl-user-button_login-body">
        {isLogin ? (
          <>
            <UserAvatar className="user-avatar" />
            <MobileLoginButtonName className="wl-user-button_login-name">
              {nameStr}
            </MobileLoginButtonName>
            <LogoutIconButton src={LogoutSvg} />
          </>
        ) : (
          <NoLoginText className="wl-user-button_no-login-text">
            Login
          </NoLoginText>
        )}
      </MobileLoginButtonBody>
    </MobileLoginButtonWrapper>
  );
}

const MobileLoginButtonWrapper = styled(ButtonPrimaryLine)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 4px;
  isolation: isolate;
  transition: all 0.3s ease-out;
  height: 36px;
`;
const MobileLoginButtonBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  & .user-avatar {
    width: 24px;
    height: 24px;
  }
`;

const MobileLoginButtonName = styled.span`
  /* flex: 1; */
  text-align: center;
  font-weight: 400;
  line-height: 17px;
  text-align: center;

  color: #718096;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const LogoutIconButton = styled.img`
  width: 18px;
  height: 18px;
`;

const NoLoginText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
