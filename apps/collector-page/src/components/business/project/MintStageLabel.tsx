/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 16:03:47
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 13:53:14
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { MintStage } from '../../../types/entities'

const MintStageColors = {
  [MintStage.LIVE]: '#3DD606',
  [MintStage.FUTURE]: '#EBB700',
  [MintStage.CLOSED]: '#EBB700',
}
export const MintStageLabels = {
  [MintStage.LIVE]: 'Live',
  [MintStage.FUTURE]: 'Future',
  [MintStage.SOLDOUT]: 'Soldout',
  [MintStage.CLOSED]: 'Closed',
}
type MintStageLabelProps = HTMLAttributes<HTMLDivElement> & {
  mintStage: MintStage
  fontSize?: string
}
const MintStageLabel: React.FC<MintStageLabelProps> = ({ mintStage, fontSize = '12px' }: MintStageLabelProps) => {
  const mintStageLabel = MintStageLabels[mintStage] || 'Unknown Project Status'
  const mintStageColor = MintStageColors[mintStage] || '#000'
  return (
    <MintStageLabelWrapper color={mintStageColor} fontSize={fontSize}>
      <MintStageLabelLeft color={mintStageColor} />
      {mintStageLabel}
    </MintStageLabelWrapper>
  )
}
export default MintStageLabel
const MintStageLabelWrapper = styled.div<{ color: string; fontSize?: string }>`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize};
  line-height: 18px;
  color: ${({ color }) => color};
`
const MintStageLabelLeft = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  line-height: 20px;
  background-color: ${({ color }) => color};
`
