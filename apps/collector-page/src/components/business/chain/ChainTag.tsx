/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-22 11:34:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 18:43:53
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { ChainIds } from '../../../utils/chain'
import IconEthereumWhite from '../../common/icons/IconEthereumWhite'
import IconSolana from '../../common/icons/IconSolana'
export type ChainTag = {
  name: string
  icon: React.FC
  bgc: string
}
export const chainMap: { [key in ChainIds]: ChainTag } = {
  [ChainIds.eth]: {
    name: 'Ethereum',
    icon: IconEthereumWhite,
    bgc: '#476DFF',
  },
  [ChainIds.solana]: {
    name: 'solana',
    icon: IconSolana,
    bgc: '#171F1C',
  },
}
type ChainTagProps = {
  chainId: number
  size?: number
}
const ChainTag: React.FC<ChainTagProps> = ({ chainId, size = 1, ...otherProps }: ChainTagProps) => {
  const chain = chainMap[chainId]
  // // 要使用的字体大小
  // const nameSize = size * 12 + 'px'

  // // 直角边长
  // const sideLen = size * 65
  // // 得出直角三角形斜边长
  // const hypotLen = Math.hypot(sideLen, sideLen)
  // // 得出要使用的 border 高度
  // const borderHeight = hypotLen / 2
  // // 得出外出盒子大小
  // const wrapperSize = sideLen + 'px'
  // // 得出要设定的边框高度
  // const borderHeightSize = borderHeight + 'px'
  // // 直边和斜边的比例
  // const sideHypotRate = sideLen / hypotLen
  // // 得出要使用的icon大小
  // const iconSize = sideHypotRate * size * 30 + 'px'

  return (
    <ChainTagWrapper bgc={chain?.bgc || '#476DFF'} {...otherProps}>
      {chain && <chain.icon size={'14px'} />}
      {chain?.name || 'Unknown Chain'}
    </ChainTagWrapper>
    // <ChainTagWrapper size={wrapperSize} {...otherProps}>
    //   <ChainTagBodyBox borderHeight={borderHeightSize} bgc={chain.bgc}>
    //     <ChainTagBody moveHeight={borderHeightSize}>
    //       {chain && <chain.icon size={iconSize} />}
    //       <ChainNameBox size={nameSize}>{chain && chain.name}</ChainNameBox>
    //     </ChainTagBody>
    //   </ChainTagBodyBox>
    // </ChainTagWrapper>
  )
}
export default ChainTag
const ChainTagWrapper = styled.div<{ bgc: string }>`
  height: 22px;
  padding: 4px;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  color: #ffffff;
  background: ${(props) => props.bgc};
  display: flex;
  align-items: center;
  gap: 5px;

  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`
// const ChainTagWrapper = styled.div<{ size: string }>`
//   width: ${({ size }) => size};
//   height: ${({ size }) => size};
//   position: absolute;
//   top: 0;
//   left: 0;
//   overflow: hidden;
// `
// const ChainTagBodyBox = styled.div<{ borderHeight: string; bgc: string }>`
//   width: 0;
//   height: 0;
//   border-left: ${({ borderHeight }) => borderHeight} solid transparent;
//   border-right: ${({ borderHeight }) => borderHeight} solid transparent;
//   border-top: ${({ borderHeight }) => borderHeight} solid transparent;
//   border-bottom: ${({ borderHeight }) => borderHeight} solid ${({ bgc }) => bgc};
//   position: relative;
//   transform: translate(-50%, -50%) rotate(-45deg);
//   z-index: 1;
// `
// const ChainTagBody = styled.div<{ moveHeight: string }>`
//   position: absolute;
//   bottom: -${({ moveHeight }) => moveHeight};
//   transform: translateX(-50%);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `
// const ChainNameBox = styled.div<{ size: string }>`
//   color: #fff;
//   text-transform: uppercase;
//   font-size: ${({ size }) => size};
//   font-weight: bold;
// `
