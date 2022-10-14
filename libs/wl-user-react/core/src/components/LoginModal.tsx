/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 16:55:19
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import ModalBase from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import LoginSignerButton from './LoginSignerButton';
import { SignerType } from '../signer';
export type LoginModalProps = {
  isOpen: boolean;
  onLoginEnd?: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginEnd,
}: LoginModalProps) => {
  const { signer, user, isLogin, signers } = useWlUserReact();
  // TODO： 推荐signer暂时先默认使用Twitter (后续改为上次签名使用的 signer)
  const recommendSigner = signers.find(
    (item) => item.signerType === SignerType.TWITTER
  );
  const otherSigners = signers.filter((item) => item !== recommendSigner);
  return (
    <LoginModalWrapper isOpen={isOpen}>
      <LoginModalBody className="wl-user-modal_login-body">
        <LoginModalTitle isMobile={isMobile}>Connect With</LoginModalTitle>
        <LoginModalRecommendBox className="wl-user-modal_login-recommend-box">
          {recommendSigner && (
            <LoginSignerButton
              signerType={recommendSigner.signerType}
              onLoginEnd={onLoginEnd}
            ></LoginSignerButton>
          )}
        </LoginModalRecommendBox>
      </LoginModalBody>
    </LoginModalWrapper>
  );
};
export default LoginModal;

const LoginModalWrapper = styled(ModalBase)`
  width: 200px;
  height: 48px;
`;
const LoginModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;

  position: relative;
  width: 384px;
  height: 250px;

  background: #f7f9f1;
  border-radius: 20px;
`;
const LoginModalTitle = styled.p<{ isMobile: boolean }>`
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
  ${({ isMobile }) =>
    isMobile &&
    `
    font-size: 14px;
    line-height: 21px;
  `}
`;
const LoginModalRecommendBox = styled.div``;
