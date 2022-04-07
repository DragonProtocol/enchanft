/*
 * @Author: your name
 * @Date: 2022-03-16 12:16:45
 * @LastEditTime: 2022-04-07 14:36:32
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \synft-app\src\components\common\ButtonConnectWallet.tsx
 */
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styled from 'styled-components'
import { ButtonBaseCss, ButtonProps } from './ButtonBase'

const ButtonConnectWallect: React.FC<ButtonProps> = ({ children, ...otherProps }: ButtonProps) => {
  const wallet = useWallet()
  return (
    <ButtonConnectWallectWrapper {...otherProps}>
      {children || (!wallet.publicKey && 'Connect Wallet')}
    </ButtonConnectWallectWrapper>
  )
}
export default ButtonConnectWallect
const ButtonConnectWallectWrapper = styled(WalletMultiButton)`
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
