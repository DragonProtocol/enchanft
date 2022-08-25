import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ButtonPrimary, ButtonWarning } from '../../common/button/ButtonBase'
import IconWebsite from '../../common/icons/IconWebsite'
import IconTwitterBlack from '../../common/icons/IconTwitterBlack'
import IconDiscordBlack from '../../common/icons/IconDiscordBlack'
import { getTwitterHomeLink } from '../../../utils/twitter'
import { ChainType } from '../../../utils/chain'
export type ProjectDetailCommunityDataType = {
  id: number
  name: string
  icon: string
  website: string
  twitter: string
  twitterId: string
  discord: string
  discordInviteUrl: string
}

export enum FollowStatusType {
  CONNECT_WALLET = 'CONNECT_WALLET',
  BIND_WALLET = 'BIND_WALLET',
  FOLLOW = 'FOLLOW',
  FOLLOWING = 'FOLLOWING',
  FOLLOWED = 'FOLLOWED',
  UNKNOWN = 'UNKNOWN',
}
export type ProjectDetailCommunityViewConfigType = {
  followStatusType?: FollowStatusType
  bindWalletType?: ChainType
}

export type ProjectDetailCommunityDataViewType = {
  data: ProjectDetailCommunityDataType
  viewConfig?: ProjectDetailCommunityViewConfigType
}
export type ProjectDetailCommunityHandlesType = {
  onFollow?: () => void
  onConnectWallet?: () => void
  onBindWallet?: (chainType: ChainType) => void
}
export type ProjectDetailCommunityProps = ProjectDetailCommunityDataViewType & ProjectDetailCommunityHandlesType

const defaultViewConfig = {
  followStatusType: FollowStatusType.UNKNOWN,
  bindWalletType: ChainType.UNKNOWN,
}

const bindWalletTypeBtnTextMap = {
  [ChainType.EVM]: 'Bind MetaMask',
  [ChainType.SOLANA]: 'Bind Phantom',
  [ChainType.UNKNOWN]: 'unknown chain type',
}
const ProjectDetailCommunity: React.FC<ProjectDetailCommunityProps> = ({
  data,
  viewConfig,
  onFollow,
  onConnectWallet,
  onBindWallet,
}: ProjectDetailCommunityProps) => {
  const { name, icon, website, twitterId, discordInviteUrl } = data
  const twitterHomeLink = getTwitterHomeLink(twitterId)
  const { followStatusType, bindWalletType } = {
    ...defaultViewConfig,
    ...viewConfig,
  }
  const handleFollow = () => {
    if (onFollow) {
      onFollow()
    }
  }
  const handleConnectWallet = () => {
    if (onConnectWallet) {
      onConnectWallet()
    }
  }
  const handleBindWallet = () => {
    if (onBindWallet) {
      onBindWallet(bindWalletType)
    }
  }
  const renderFollowBtn = useCallback(() => {
    switch (followStatusType) {
      case FollowStatusType.CONNECT_WALLET:
        return <WalletBtn onClick={handleConnectWallet}>Connect Wallet</WalletBtn>
      case FollowStatusType.BIND_WALLET:
        return <WalletBtn onClick={handleBindWallet}>{bindWalletTypeBtnTextMap[bindWalletType]}</WalletBtn>
      case FollowStatusType.FOLLOW:
        return <FollowBtn onClick={handleFollow}>Join</FollowBtn>
      case FollowStatusType.FOLLOWING:
        return <FollowBtn disabled>following ...</FollowBtn>
      case FollowStatusType.FOLLOWED:
        return <FollowBtn disabled>Joined</FollowBtn>
      default:
        return null
    }
  }, [followStatusType, bindWalletType])
  return (
    <ProjectDetailCommunityWrapper>
      {/* <CommunityImg src={icon} /> */}
      {/* <CommunityName>{name}</CommunityName> */}
      <CommunityLeftBox>
        <ProjectLink href={website} target="_blank" rel="noopener noreferrer">
          <IconWebsite />
        </ProjectLink>
        <ProjectLink href={twitterHomeLink} target="_blank" rel="noopener noreferrer">
          <IconTwitterBlack />
        </ProjectLink>
        <ProjectLink href={discordInviteUrl} target="_blank" rel="noopener noreferrer">
          <IconDiscordBlack />
        </ProjectLink>
      </CommunityLeftBox>
      {renderFollowBtn()}
    </ProjectDetailCommunityWrapper>
  )
}
export default ProjectDetailCommunity
const ProjectDetailCommunityWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CommunityImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
`
const CommunityName = styled.div`
  flex: 1;
  font-weight: 700;
  font-size: 24px;
  color: #333333;
`

const CommunityLeftBox = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`
const ProjectLink = styled.a`
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const FollowBtn = styled(ButtonWarning)`
  min-width: 100px;
  height: 40px;
  font-weight: 700;
  font-size: 18px;
`
const WalletBtn = styled(ButtonPrimary)`
  min-width: 100px;
  height: 40px;
  font-weight: 700;
  font-size: 18px;
`
