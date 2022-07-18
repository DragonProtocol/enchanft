import React from 'react'
import styled from 'styled-components'
import ButtonBase from '../../common/button/ButtonBase'
import { useNavigate } from 'react-router-dom'
import { ScrollBarCss } from '../../../GlobalStyle'

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
  const { id, name, icon, website, description, discord, twitter, memberNums, contribution, isFollowed } = data
  const { disabledFollow, displayFollow, loadingFollow } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const onFollowChangeClick = () => {
    if (onFollowChange) {
      onFollowChange(!isFollowed)
    }
  }
  const communityDescBottomText = `${memberNums} members . ${contribution} contribution`
  return (
    <CommunityItemWrapper onClick={() => navigate(`/community/${id}`)}>
      <CommunityImage src={icon} />
      <CommunityDescBox>
        <CommunityDescTopBox>
          <CommunityName>{name}</CommunityName>
          {displayFollow && (
            <CommunityFollow disabled={disabledFollow} isFollowed={isFollowed} onClick={onFollowChangeClick}>
              {isFollowed ? 'Joined' : 'Join'}
            </CommunityFollow>
          )}
        </CommunityDescTopBox>
        <CommunityDescBottomBox>{communityDescBottomText}</CommunityDescBottomBox>
      </CommunityDescBox>
    </CommunityItemWrapper>
  )
}
export default CommunityItem
const CommunityItemWrapper = styled.div`
  width: 100%;
  height: 330px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 100);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`
const CommunityImage = styled.img`
  width: 100%;
  height: 206px;
`
const CommunityDescBox = styled.div`
  flex: 1;
  padding-top: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${ScrollBarCss}
`
// top
const CommunityDescTopBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
`
const CommunityName = styled.div`
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  font-weight: bold;
`
const CommunityFollow = styled(ButtonBase)<{ isFollowed: boolean }>`
  width: 80px;
  height: auto;
  padding: 5px 0;
  border: 1px solid rgba(51, 53, 54, 100);
  box-sizing: border-box;
  border-radius: 4px;
  background-color: ${(props) => (props.isFollowed ? '#fff' : 'rgba(51, 53, 54, 100)')};
  color: ${(props) => (props.isFollowed ? 'rgba(51, 53, 54, 100)' : '#fff')};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: none;
`
// bottom
const CommunityDescBottomBox = styled.div`
  font-size: 20px;
`
