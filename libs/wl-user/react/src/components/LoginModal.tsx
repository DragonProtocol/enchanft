/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 17:53:22
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
  const { signers, getSigner } = useWlUserReact();
  // 推荐signer暂时先默认使用Twitter
  const recommendSigner = getSigner(SignerType.TWITTER);
  // 将支持的otherSigners作为登录选项
  const excloudOtherSigners = [SignerType.TWITTER, SignerType.DISCORD];
  const otherSigners = signers.filter(
    (item) => !excloudOtherSigners.includes(item.signerType)
  );
  const [otherSignersDisplay, setOtherSignersDisplay] = useState(false);
  return (
    <LoginModalWrapper isOpen={isOpen} {...modalProps}>
      <LoginModalBody className="wl-user-modal_login-body">
        <ModalBaseTitle>Login With</ModalBaseTitle>
        <LoginSignerRecommendBox className="wl-user-modal_login-recommend-box">
          {recommendSigner && (
            <LoginWithSignerButton
              signerType={recommendSigner.signerType}
            ></LoginWithSignerButton>
          )}
        </LoginSignerRecommendBox>
        {isDesktop && (
          <>
            <OtherSignersDisplayBtn
              onClick={() => setOtherSignersDisplay(!otherSignersDisplay)}
            >
              other signatories {otherSignersDisplay ? '▲' : '▼'}
            </OtherSignersDisplayBtn>
            {otherSignersDisplay && (
              <LoginSignerOthersBox>
                {otherSigners.map((signer) => (
                  <LoginWithSignerButton
                    key={signer.signerType}
                    signerType={signer.signerType}
                  ></LoginWithSignerButton>
                ))}
              </LoginSignerOthersBox>
            )}
          </>
        )}
      </LoginModalBody>
    </LoginModalWrapper>
  );
};
export default LoginModal;

const LoginModalWrapper = styled(ModalBase)``;
const LoginModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  position: relative;
  background: #f7f9f1;
  border-radius: 20px;
  min-width: 200px;
  max-width: 560px;
  max-height: 560px;
  transition: all 2s linear;
`;
const LoginSignerRecommendBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const OtherSignersDisplayBtn = styled.div`
  text-align: center;
  cursor: pointer;
`;
const LoginSignerOthersBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;
