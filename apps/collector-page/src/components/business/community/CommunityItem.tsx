import React from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'
import { useNavigate } from 'react-router-dom'
import { ScrollBarCss } from '../../../GlobalStyle'
import OverflowEllipsisBox from '../../common/text/OverflowEllipsisBox'

export type CommunityItemDataType = {
  id: number
  name: string
  icon: string
  website: string
  description: string
  discord: string
  twitter: string
  memberNums: number
  contribution: number
  project: {
    slug: string
  }
  isFollowed: boolean
}

export type CommunityItemViewConfigType = {
  displayFollow?: boolean
  disabledFollow?: boolean
  loadingFollow?: boolean
}

export type CommunityItemDataViewType = {
  data: CommunityItemDataType
  viewConfig?: CommunityItemViewConfigType
}

export type CommunityItemHandlesType = {
  onFollowChange?: (isFollowed: boolean) => void
}

export type CommunityItemProps = CommunityItemDataViewType & CommunityItemHandlesType

const defaultViewConfig: CommunityItemViewConfigType = {
  displayFollow: false,
  disabledFollow: false,
  loadingFollow: false,
}

const CommunityItem: React.FC<CommunityItemProps> = ({ data, viewConfig, onFollowChange }: CommunityItemProps) => {
  const navigate = useNavigate()
  const { id, name, icon, website, description, discord, twitter, memberNums, contribution, project, isFollowed } = data
  const { disabledFollow, displayFollow, loadingFollow } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const onFollowChangeClick = () => {
    if (onFollowChange) {
      onFollowChange(!isFollowed)
    }
  }
  return (
    <CommunityItemWrapper onClick={() => navigate(`/${project.slug}`)}>
      <CommunityImage src={icon} />
      <CommunityInfoBox>
        <CommunityName>{name}</CommunityName>
        <NumberInfoBox>
          <NumberRow>
            <NumberLabel>members</NumberLabel>
            <NumberValue>{memberNums}</NumberValue>
          </NumberRow>
          <NumberRow>
            <NumberLabel>contribution Point</NumberLabel>
            <NumberValue>{contribution}</NumberValue>
          </NumberRow>
        </NumberInfoBox>
        {displayFollow && (
          <CommunityFollow disabled={disabledFollow} isFollowed={isFollowed} onClick={onFollowChangeClick}>
            {isFollowed ? 'Joined' : 'Join'}
          </CommunityFollow>
        )}
      </CommunityInfoBox>
    </CommunityItemWrapper>
  )
}
export default CommunityItem
const CommunityItemWrapper = styled.div`
  width: 100%;
  height: 450px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  background: #ffffff;
  border: 2px solid #333333;
  box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
`
const CommunityImage = styled.img`
  width: 100%;
  height: 265px;
  object-fit: cover;
`
const CommunityInfoBox = styled.div`
  flex: 1;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  ${ScrollBarCss}
`
const NumberInfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px dashed rgba(51, 51, 51, 0.3);
  border-bottom: 1px dashed rgba(51, 51, 51, 0.3);
  padding: 8px 0;
`
const NumberRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const NumberLabel = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.6);
`
const NumberValue = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #333333;
`

const CommunityName = styled(OverflowEllipsisBox)`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const CommunityFollow = styled(ButtonBase)<{ isFollowed: boolean }>`
  height: 40px;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  background-color: ${(props) => (props.isFollowed ? '#f8f8f8' : 'rgba(51, 53, 54, 100)')};
  color: ${(props) => (props.isFollowed ? 'rgba(51, 53, 54, 100)' : '#f8f8f8')};
`
