/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 16:46:44
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

export type LoginModalProps = ModalBaseProps;

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  ...modalProps
}: LoginModalProps) => {
  const { authorizers, authorizer } = useWlUserReact();
  // 推荐authorizer暂时先默认使用Twitter
  const recommendAuthorizer = authorizer || authorizers[0];
  // 将支持的otherAuthorizers作为登录选项
  const otherAuthorizers = authorizers.filter(
    (item) => recommendAuthorizer.type !== item.type
  );
  const [otherAuthorizersDisplay, setOtherAuthorizersDisplay] = useState(false);
  return (
    <LoginModalWrapper isOpen={isOpen} {...modalProps}>
      <LoginModalBody className="wl-user-modal_login-body">
        <ModalBaseTitle>Login With</ModalBaseTitle>
        <LoginAuthorizerList>
          {recommendAuthorizer && (
            <RecommendLoginButton authorizerType={recommendAuthorizer.type} />
          )}
          {isDesktop && (
            <>
              {otherAuthorizersDisplay &&
                otherAuthorizers.map((item) => (
                  <MoreLoginButton key={item.type} authorizerType={item.type} />
                ))}
              <OtherAuthorizersDisplayBtn
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
};
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
  .wl-user-button-login_authorizer-icon {
    width: 50px;
    height: 50px;
  }
`;
const MoreLoginButton = styled(LoginWithAuthorizerButton)`
  width: 100%;
`;
