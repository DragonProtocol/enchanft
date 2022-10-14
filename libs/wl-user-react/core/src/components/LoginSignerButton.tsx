/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 16:55:26
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import { SignerType } from '../signer';
import { ButtonPrimary } from './common/button/ButtonBase';
import { SignerButtonStyleMap } from './signerStyle';

export type LoginSignerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  signerType: SignerType;
  onLoginEnd?: () => void;
};

const LoginSignerButton: React.FC<LoginSignerButtonProps> = ({
  children,
  onLoginEnd,
  signerType,
  ...otherProps
}: LoginSignerButtonProps) => {
  const signerStyle = SignerButtonStyleMap[signerType];
  const { signers, updateUser, setSigner } = useWlUserReact();
  const signer = signers.find((item) => item.signerType === signerType);
  const [isSigning, setIsSigning] = useState(false);
  const handleSignerLogin = async () => {
    if (signer) {
      setIsSigning(true);
      const loginResult = await signer.login();
      updateUser(loginResult);
      setSigner(signer);
      setIsSigning(false);
      onLoginEnd && onLoginEnd();
    }
  };
  return (
    <LoginSignerButtonWrapper
      onClick={handleSignerLogin}
      disabled={isSigning}
      bgColor={signerStyle.bgColor}
      {...otherProps}
    >
      <SignerSignerButtonIconBox className="wl-user-button-login_signer-icon-box">
        {signerStyle.icon}
      </SignerSignerButtonIconBox>

      <SignerButtonName
        color={signerStyle.nameColor}
        className="wl-user-button-login_signer-name"
      >
        {isSigning ? 'signing ...' : signerStyle.name}
      </SignerButtonName>
    </LoginSignerButtonWrapper>
  );
};
export default LoginSignerButton;

const LoginSignerButtonWrapper = styled(ButtonPrimary)<{ bgColor: string }>`
  width: 160px;
  height: 160px;
  background-color: ${({ bgColor }) => bgColor};
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;
const SignerSignerButtonIconBox = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SignerButtonName = styled.span<{ color: string }>`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: ${({ color }) => color};
`;
