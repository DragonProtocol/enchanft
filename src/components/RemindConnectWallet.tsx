/*
 * @Author: shixuewen
 * @Date: 2022-03-23 14:24:51
 * @LastEditTime: 2022-06-27 11:48:27
 * @LastEditors: shixuewen friendlysxw@163.com
 * @Description: 提醒链接钱包的可复用布局组件
 * @FilePath: \synft-app\src\components\RemindConnectWallet.tsx
 */
import styled from 'styled-components'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import ButtonConnectWallect from './common/ButtonConnectWallet'
import WalletTextIcon from './icons/walletText.svg'
const RemindConnectWallet: React.FC = () => {
  return (
    <RemindConnectWalletWrapper>
      <WalletIcon src={WalletTextIcon} />
      <ConnectDesc>Please Connect Wallet First</ConnectDesc>
      <ButtonConnectWallect
        style={{
          width: '200px',
        }}
      />
    </RemindConnectWalletWrapper>
  )
}
export default RemindConnectWallet
const RemindConnectWalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`
const WalletIcon = styled.img`
  font-style: normal;
  font-size: 40px;
  line-height: 40px;
  color: #000000;
`
const ConnectDesc = styled.span`
  font-size: 20px;
  line-height: 40px;
  text-transform: uppercase;
  color: #333333;
  text-align: center;
`

// v1.0 code

// const RemindConnectWallet: React.FC = () => {
//   return (
//     <RemindConnectWalletWrapper>
//       <span className="connect-desc">connect your NFT</span>
//       <ButtonConnectWallect />
//     </RemindConnectWalletWrapper>
//   )
// }
// export default RemindConnectWallet
// const RemindConnectWalletWrapper = styled.div`
//   display: flex;
//   background: #fffbdb;
//   border: 4px solid #222222;
//   box-sizing: border-box;
//   box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
//   border-radius: 2px;
//   padding: 26px 24px;
//   margin: 35px 0;
//   justify-content: space-between;
//   align-items: center;
//   @media (max-width: ${MOBILE_BREAK_POINT}px) {
//     flex-direction: column;
//   }
//   .connect-desc {
//     font-size: 18px;
//     line-height: 40px;
//     color: #222222;
//     text-transform: uppercase;
//   }
// `
