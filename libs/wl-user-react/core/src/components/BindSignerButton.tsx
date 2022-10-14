/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 16:55:12
 * @Description: file description
 */
import React, { ButtonHTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import { useWlUserReact } from '../provider';
import { SignerType } from '../signer';
import { getAccountDisplayName, signerTypeToAccountTyp } from '../utils';
import ButtonBase from './common/button/ButtonBase';
import { SignerButtonStyleMap } from './signerStyle';

export type BindSignerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  signerType: SignerType;
  onBindEnd?: () => void;
};

const BindSignerButton: React.FC<BindSignerButtonProps> = ({
  children,
  signerType,
  onBindEnd,
  ...otherProps
}: BindSignerButtonProps) => {
  const { user, isLogin, volidBindAccount, updateUser, signers } =
    useWlUserReact();
  const signer = signers.find((item) => item.signerType === signerType);
  const signerStyle = SignerButtonStyleMap[signerType];
  const accountType = signerTypeToAccountTyp(signerType);
  const isBind = accountType && volidBindAccount(accountType);
  const nameStr = getAccountDisplayName(user, signerType);
  const [isSigning, setIsSigning] = useState(false);
  const handleSignerBind = async () => {
    if (signer) {
      setIsSigning(true);
      const result = await signer.bind(user.token);
      updateUser({ accounts: result });
      setIsSigning(false);
      onBindEnd && onBindEnd();
    }
  };
  return (
    <BindSignerButtonWrapper
      bgColor={signerStyle.bgColor}
      disabled={!isLogin || isBind || isSigning}
      onClick={handleSignerBind}
      {...otherProps}
    >
      <SignerButtonIconBox className="wl-user-button-bind_signer-icon-box">
        {signerStyle.icon}
      </SignerButtonIconBox>

      <SignerButtonName
        color={signerStyle.nameColor}
        className="wl-user-button-bind_signer-name"
      >
        {isSigning ? 'signing ...' : nameStr}
      </SignerButtonName>
    </BindSignerButtonWrapper>
  );
};
export default BindSignerButton;

const BindSignerButtonWrapper = styled(ButtonBase)<{ bgColor: string }>`
  width: 200px;
  height: 48px;
  background-color: ${({ bgColor }) => bgColor};
`;
const SignerButtonIconBox = styled.div`
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
