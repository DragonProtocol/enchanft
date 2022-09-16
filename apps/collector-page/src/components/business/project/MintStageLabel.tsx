/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 16:03:47
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-14 17:24:56
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
}
const MintStageLabel: React.FC<MintStageLabelProps> = ({ mintStage, ...divProps }: MintStageLabelProps) => {
  const mintStageLabel = MintStageLabels[mintStage] || 'Unknown Project Status'
  const mintStageColor = MintStageColors[mintStage] || '#000'
  return (
    <MintStageLabelWrapper color={mintStageColor} {...divProps}>
      <MintStageLabelLeft color={mintStageColor} />
      {mintStageLabel}
    </MintStageLabelWrapper>
  )
}
export default MintStageLabel
const MintStageLabelWrapper = styled.div<{ color: string }>`
  display: flex;
  gap: 10px;
  align-items: center;
  line-height: 18px;
  color: ${({ color }) => color};
`
const MintStageLabelLeft = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
`
