/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-02 11:18:04
 * @Description: file description
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import ModalBase, {
  ModalBaseProps,
  ModalBaseTitle,
} from './common/modal/ModalBase';
import { isDesktop, isMobile } from 'react-device-detect';
import LoginWithSignerButton from './LoginWithSignerButton';
import { SignerType } from '@ecnft/wl-user-core';
export type LoginModalProps = ModalBaseProps;

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  ...modalProps
}: LoginModalProps) => {
  const { signers, getSigner, signer } = useWlUserReact();
  // 推荐signer暂时先默认使用Twitter
  const recommendSigner = signer || getSigner(SignerType.TWITTER);
  // 将支持的otherSigners作为登录选项
  const excloudOtherSigners = [recommendSigner.signerType];
  const otherSigners = signers.filter(
    (item) => !excloudOtherSigners.includes(item.signerType)
  );
  const [otherSignersDisplay, setOtherSignersDisplay] = useState(false);
  return (
    <LoginModalWrapper isOpen={isOpen} {...modalProps}>
      <LoginModalBody className="wl-user-modal_login-body">
        <ModalBaseTitle>Login With</ModalBaseTitle>
        <LoginSignerList>
          {recommendSigner && (
            <RecommendLoginButton
              signerType={recommendSigner.signerType}
            ></RecommendLoginButton>
          )}
          {isDesktop && (
            <>
              {otherSignersDisplay &&
                otherSigners.map((signer) => (
                  <MoreLoginButton
                    key={signer.signerType}
                    signerType={signer.signerType}
                  ></MoreLoginButton>
                ))}
              <OtherSignersDisplayBtn
                onClick={() => setOtherSignersDisplay(!otherSignersDisplay)}
              >
                {otherSignersDisplay ? 'Less options ▲' : 'More options  ▼'}
              </OtherSignersDisplayBtn>
            </>
          )}
        </LoginSignerList>
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
const LoginSignerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const OtherSignersDisplayBtn = styled.div`
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`;
const RecommendLoginButton = styled(LoginWithSignerButton)`
  width: 100%;
  height: 160px;
  flex-direction: column;
  .wl-user-button-login_signer-icon {
    width: 50px;
    height: 50px;
  }
`;
const MoreLoginButton = styled(LoginWithSignerButton)`
  width: 100%;
`;
