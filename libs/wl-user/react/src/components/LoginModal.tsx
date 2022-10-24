/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-21 17:20:19
 * @Description: file description
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import ModalBase, {
  ModalBaseProps,
  ModalBaseTitle,
} from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import LoginWithSignerButton from './LoginWithSignerButton';
import { SignerType } from '@ecnft/wl-user-core';
export type LoginModalProps = ModalBaseProps;

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  ...modalProps
}: LoginModalProps) => {
  const { signers, getSigner } = useWlUserReact();
  // TODO： 推荐signer暂时先默认使用Twitter (后续改为上次签名使用的 signer)
  const recommendSigner = getSigner(SignerType.TWITTER);
  // TODO: 后期可将支持的otherSigners作为登录选项
  const otherSigners = signers.filter((item) => item !== recommendSigner);
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
        {/* <OtherSignersDisplayBtn
          onClick={() => setOtherSignersDisplay(!otherSignersDisplay)}
        >
          others signer {otherSignersDisplay ? '▲' : '▼'}
        </OtherSignersDisplayBtn>
        {otherSignersDisplay && (
          <LoginSignerOthersBox>
            {otherSigners.map((signer) => (
              <LoginWithSignerButton
                signerType={signer.signerType}
              ></LoginWithSignerButton>
            ))}
          </LoginSignerOthersBox>
        )} */}
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
