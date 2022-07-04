/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:30:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 10:32:47
 * @Description: 钱包连接按钮
 */
import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styled from 'styled-components'
import { ButtonBaseCss, ButtonProps } from '../../common/button/ButtonBase'

const SolanaConnectWalletButton: React.FC<ButtonProps> = ({ children, ...otherProps }: ButtonProps) => {
  const { publicKey } = useWallet()
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SolanaConnectWalletButtonWrapper {...otherProps}>
      {children || (!publicKey && 'Connect Wallet')}
    </SolanaConnectWalletButtonWrapper>
  )
}

export default SolanaConnectWalletButton
const SolanaConnectWalletButtonWrapper = styled(WalletMultiButton)`
  // 重置solana按钮默认样式 - start
  margin: 0;
  padding: 0 6px;
  border: none;
  outline: none;
  &:hover {
    background: #3dd606;
  }
  line-height: 16px;
  // 重置solana按钮默认样式 - end

  ${ButtonBaseCss}
  background: #3dd606 !important;
  border-radius: 0;
`
