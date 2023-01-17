/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 14:31:46
 * @Description: file description
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { isDesktop, isMobile } from 'react-device-detect';
import ModalBase, {
  ModalBaseProps,
  ModalBaseTitle,
} from './common/modal/ModalBase';
import LoginWithAuthorizerButton from './LoginWithAuthorizerButton';
import { useWlUserReact } from '../hooks';
import { AuthorizerType } from '../authorizers/authorizer';
import { createClassNamesByTheme } from '../utils/style';

export type LoginModalProps = ModalBaseProps;

function LoginModal({ isOpen, ...modalProps }: LoginModalProps) {
  const { authorizers, authorizer, theme } = useWlUserReact();
  // TODO email 登录接口完成后删除此筛选程序
  const supportedAuthorizers = authorizers.filter(
    (item) => item.type !== AuthorizerType.EMAIL
  );
  // 推荐authorizer暂时先默认使用Twitter
  const recommendAuthorizer = authorizer || supportedAuthorizers[0];
  // 将支持的otherAuthorizers作为登录选项
  const otherAuthorizers = supportedAuthorizers.filter(
    (item) => recommendAuthorizer.type !== item.type
  );
  const [otherAuthorizersDisplay, setOtherAuthorizersDisplay] = useState(false);
  return (
    <LoginModalWrapper
      isOpen={isOpen}
      className={createClassNamesByTheme('wl-user-modal_login', theme)}
      {...modalProps}
    >
      <LoginModalBody className="wl-user-modal_login-body">
        <ModalBaseTitle>Login With</ModalBaseTitle>
        <LoginAuthorizerList className="login-options">
          {recommendAuthorizer && (
            <RecommendLoginButton
              authorizerType={recommendAuthorizer.type}
              className="login-option-recomend"
            />
          )}
          {isDesktop && (
            <>
              {otherAuthorizersDisplay &&
                otherAuthorizers.map((item) => (
                  <MoreLoginButton
                    key={item.type}
                    authorizerType={item.type}
                    className="login-option-other"
                  />
                ))}
              <OtherAuthorizersDisplayBtn
                className="login-other-display"
                onClick={() =>
                  setOtherAuthorizersDisplay(!otherAuthorizersDisplay)
                }
              >
                {otherAuthorizersDisplay ? 'Less options ▲' : 'More options  ▼'}
              </OtherAuthorizersDisplayBtn>
            </>
          )}
        </LoginAuthorizerList>
      </LoginModalBody>
    </LoginModalWrapper>
  );
}
export default LoginModal;

const LoginModalWrapper = styled(ModalBase)``;
const LoginModalBody = styled.div`
  width: 384px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  position: relative;
  background: #f7f9f1;
  border-radius: 20px;
`;
const LoginAuthorizerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const OtherAuthorizersDisplayBtn = styled.div`
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`;
const RecommendLoginButton = styled(LoginWithAuthorizerButton)`
  width: 100%;
  height: 160px;
  flex-direction: column;
  .authorizer-icon {
    width: 50px;
    height: 50px;
  }
`;
const MoreLoginButton = styled(LoginWithAuthorizerButton)`
  width: 100%;
`;
