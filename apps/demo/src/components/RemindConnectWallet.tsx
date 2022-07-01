/*
 * @Author: shixuewen
 * @Date: 2022-03-23 14:24:51
 * @LastEditTime: 2022-03-23 14:36:31
 * @LastEditors: Please set LastEditors
 * @Description: 提醒链接钱包的可复用布局组件
 * @FilePath: \synft-app\src\components\RemindConnectWallet.tsx
 */
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import ButtonConnectWallect from './common/ButtonConnectWallet'

const RemindConnectWallet: React.FC = () => {
  return (
    <RemindConnectWalletWrapper>
      <span className="connect-desc">connect your NFT</span>
      <ButtonConnectWallect />
    </RemindConnectWalletWrapper>
  )
}
export default RemindConnectWallet
const RemindConnectWalletWrapper = styled.div`
  display: flex;
  background: #fffbdb;
  border: 4px solid #222222;
  box-sizing: border-box;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  padding: 26px 24px;
  margin: 35px 0;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column;
  }
  .connect-desc {
    font-size: 18px;
    line-height: 40px;
    color: #222222;
    text-transform: uppercase;
  }
`
