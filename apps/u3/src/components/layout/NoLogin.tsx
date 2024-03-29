/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:29:11
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-03 18:28:48
 * @Description: file description
 */
import styled from 'styled-components';
import { ButtonPrimary } from '../common/button/ButtonBase';
import WalletSvg from '../common/icons/svgs/wallet.svg';
import useLogin from '../../hooks/useLogin';

function NoLogin() {
  const { login } = useLogin();
  return (
    <NoLoginWrapper>
      <NoLoginContainer>
        <Icon src={WalletSvg} />
        <MainText>No Wallet Connected</MainText>
        <SecondaryText>Get Started by connecting your wallet</SecondaryText>
        <LoginButton onClick={() => login()}>Connect Wallet</LoginButton>
      </NoLoginContainer>
    </NoLoginWrapper>
  );
}
export default NoLogin;
export const NoLoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
`;
const NoLoginContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: #1b1e23;
  border-radius: 20px;
`;
const Icon = styled.img`
  width: 100px;
  height: 100px;
`;
const MainText = styled.span`
  font-weight: 700;
  font-size: 36px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
`;
const SecondaryText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #718096;
`;
const LoginButton = styled(ButtonPrimary)`
  width: 228px;
`;
