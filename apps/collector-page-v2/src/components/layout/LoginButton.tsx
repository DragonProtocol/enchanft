/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 14:36:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 14:58:44
 * @Description: file description
 */
import {
  UserAvatar,
  useWlUserReact,
  WlUserActionType,
  WlUserModalType,
} from '@ecnft/wl-user-react';
import styled from 'styled-components';
import LogoutSvg from '../common/icons/svgs/logout.svg';
// TODO 后期从wl-user-react中导出
import { getUserDisplayName } from '../../utils/wlUserReact';

export default function LoginButton() {
  const { authorizer, user, isLogin, dispatchModal, dispatchAction } =
    useWlUserReact();
  const nameStr = authorizer && getUserDisplayName(user, authorizer);
  return (
    <LoginButtonWrapper
      onClick={() => {
        if (!isLogin) {
          dispatchModal({
            type: WlUserModalType.LOGIN,
          });
        }
      }}
    >
      <LoginButtonBody className="wl-user-button_login-body">
        {isLogin ? (
          <>
            <LoginButtonAvatar className="wl-user-button_login-avatar" />
            <LoginButtonName className="wl-user-button_login-name">
              {nameStr}
            </LoginButtonName>
            <LogoutIconButton
              src={LogoutSvg}
              onClick={() => {
                dispatchAction({ type: WlUserActionType.LOGOUT });
              }}
            />
          </>
        ) : (
          <LoginButtonName className="wl-user-button_login-name">
            Login
          </LoginButtonName>
        )}
      </LoginButtonBody>
    </LoginButtonWrapper>
  );
}

const LoginButtonWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 4px;
  isolation: isolate;

  height: 48px;

  border: 1px solid #39424c;
  border-radius: 12px;
  cursor: pointer;
`;
const LoginButtonBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LoginButtonAvatar = styled(UserAvatar)`
  width: 24px;
  height: 24px;
  border-radius: 20px;
`;
const LoginButtonName = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
const LogoutIconButton = styled.img`
  width: 24px;
  height: 24px;
`;
