import { Button, Checkbox } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChainType, selectAccount } from '../../../../features/user/accountSlice'
import { useAppSelector } from '../../../../store/hooks'
import { Action, ActionType, ActionTypeMore, State } from './state'
import { connectionSocialMedia } from '../../../../utils/socialMedia'
import TwitterIcon from '../../../ConnectBtn/TwitterIcon'
import DiscordIcon from '../../../ConnectBtn/DiscordIcon'
import IconCheckboxChecked from '../../../common/icons/IconCheckboxChecked'
import IconCheckbox from '../../../common/icons/IconCheckbox'
import IconTip from '../../../common/icons/IconTip'
import IconDiscord from '../../../common/icons/IconDiscord'
import IconNotify from '../../../common/icons/IconNotify'
import IconTwitter from '../../../common/icons/IconTwitter'

export default function SelectActions({
  refresh,
  updateStateActions,
}: {
  refresh: number
  updateStateActions: (arg0: Action[]) => void
}) {
  const account = useAppSelector(selectAccount)

  const discord = account.accounts.find((item) => item.accountType === ChainType.DISCORD)
  const twitter = account.accounts.find((item) => item.accountType === ChainType.TWITTER)

  const [followTwitter, setFollowTwitter] = useState(false)
  const [followTwitterLink, setFollowTwitterLink] = useState('')
  const [joinDiscord, setJoinDiscord] = useState(false)
  const [joinDiscordLink, setJoinDiscordLink] = useState('')
  const [joinDiscordServerId, setJoinDiscordServerId] = useState('')
  const [inviteDiscord, setInviteDiscord] = useState(false)
  const [inviteDiscordNum, setInviteDiscordNum] = useState(0)
  const [inviteFriends, setInvalidFriends] = useState(false)
  const [inviteNum, setInviteNum] = useState(0)
  const [likeTwitter, setLikeTwitter] = useState(false)
  const [likeTwitterLink, setLikeTwitterLink] = useState('')
  const [retweetTwitter, setRetweetTwitter] = useState(false)
  const [retweetTwitterLink, setRetweetTwitterLink] = useState('')
  const [joinCommunity, setJoinCommunity] = useState(false)
  const [joinCommunityContribution, setJoinCommunityContribution] = useState(false)
  const [joinCommunityContributionNum, setJoinCommunityContributionNum] = useState(0)

  useEffect(() => {
    setFollowTwitter(false)
    setFollowTwitterLink('')
    setJoinDiscord(false)
    setJoinDiscordLink('')
    setJoinDiscordServerId('')
    setInviteDiscord(false)
    setInviteDiscordNum(0)
    setInvalidFriends(false)
    setInviteNum(0)
    setLikeTwitter(false)
    setLikeTwitterLink('')
    setRetweetTwitter(false)
    setRetweetTwitterLink('')
    setJoinCommunity(false)
    setJoinCommunityContribution(false)
    setJoinCommunityContributionNum(0)
  }, [refresh])

  useEffect(() => {
    const actions: Action[] = []
    if (followTwitter && followTwitterLink) {
      const msg = document.getElementById('follow-twitter-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.FOLLOW_TWITTER,
          description: '',
          url: followTwitterLink,
        })
    }
    if (joinDiscord && joinDiscordLink && joinDiscordServerId) {
      const msg = document.getElementById('join-discord-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.DISCORD,
          typeMore: ActionTypeMore.JOIN_DISCORD,
          description: '',
          url: joinDiscordLink,
          server_id: joinDiscordServerId,
        })
    }
    if (inviteFriends && inviteNum) {
      const msg = document.getElementById('invite-friends-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.UNKNOWN,
          typeMore: ActionTypeMore.INVITE_PEOPLE,
          description: '',
          num: inviteNum,
        })
    }

    if (inviteDiscord && inviteDiscordNum) {
      const msg = document.getElementById('invite-discord-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.UNKNOWN,
          typeMore: ActionTypeMore.DISCORD_INVITES_PEOPLE,
          description: '',
          num: inviteNum,
        })
    }

    if (likeTwitter && likeTwitterLink) {
      const msg = document.getElementById('like-twitter-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.LIKE_TWEET,
          description: '',
          url: likeTwitterLink,
        })
    }
    if (retweetTwitterLink && retweetTwitter) {
      const msg = document.getElementById('retweet-twitter-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.RETWEET,
          description: '',
          url: retweetTwitterLink,
        })
    }
    if (joinCommunity) {
      const msg = document.getElementById('join-community-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.NOTIFY,
          typeMore: ActionTypeMore.TURN_ON_NOTIFICATION,
          description: '',
        })
    }
    if (joinCommunityContribution && joinCommunityContributionNum) {
      const msg = document.getElementById('join-community-contribution-msg')?.textContent
      msg &&
        actions.push({
          name: msg,
          type: ActionType.UNKNOWN,
          typeMore: ActionTypeMore.MEET_CONTRIBUTION_SCORE,
          description: '',
          require_score: joinCommunityContributionNum,
        })
    }
    updateStateActions(actions)
  }, [
    discord,
    twitter,
    followTwitterLink,
    followTwitter,
    joinDiscord,
    joinDiscordLink,
    joinDiscordServerId,
    inviteFriends,
    inviteNum,
    likeTwitter,
    likeTwitterLink,
    retweetTwitter,
    retweetTwitterLink,
    joinCommunity,
    joinCommunityContribution,
    joinCommunityContributionNum,
  ])

  function numberInput(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault()
    }
  }

  return (
    <SelectActionsBox>
      <div className="subtitle">
        <span>Select actions</span>
      </div>
      <div className="content">
        <div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={followTwitter}
                onChange={() => {
                  if (twitter) setFollowTwitter(!followTwitter)
                }}
              />
              <span id="follow-twitter-msg" className="msg">
                Follow @{twitter?.thirdpartyName || 'XXX'} on Twitter
              </span>
              <IconTwitter />
            </div>
            <div className="help">
              {twitter ? (
                followTwitter && (
                  <div className="input-box">
                    <span>Tweet Link:</span>
                    <input
                      type="text"
                      title="task-like"
                      value={followTwitterLink}
                      onChange={(e) => setFollowTwitterLink(e.target.value)}
                    />
                  </div>
                )
              ) : (
                <ConnectTwitter />
              )}
            </div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={joinDiscord}
                onChange={() => {
                  if (discord) setJoinDiscord(!joinDiscord)
                }}
              />{' '}
              <span id="join-discord-msg" className="msg">
                Join #{discord?.thirdpartyName || 'XXX'} server on Discord
              </span>
              <IconDiscord />
            </div>
            <div className="help">
              {discord ? (
                joinDiscord && (
                  <>
                    <div className="input-box">
                      <span>Discord Server Link:</span>
                      <input
                        type="text"
                        title="task-like"
                        value={joinDiscordLink}
                        onChange={(e) => setJoinDiscordLink(e.target.value)}
                      />
                    </div>
                    <div className="input-box">
                      <span>Discord Server Id:</span>
                      <input
                        type="text"
                        title="task-like"
                        value={joinDiscordServerId}
                        onChange={(e) => setJoinDiscordServerId(e.target.value)}
                      />
                    </div>
                  </>
                )
              ) : (
                <ConnectDiscord />
              )}
            </div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={inviteDiscord}
                onChange={() => {
                  if (discord) setInviteDiscord(!inviteDiscord)
                }}
              />
              <span id="invite-discord-msg" className="msg">
                Invite
                <input
                  placeholder="X"
                  title="invite-discord"
                  value={inviteDiscordNum === 0 ? '' : inviteDiscordNum.toString()}
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (discord) setInviteDiscordNum(Number(e.target.value))
                  }}
                />
                <span>{` ${inviteDiscordNum} `}</span>
                friends to join #{discord?.thirdpartyName || 'XXX'} server on Discord
              </span>
              <IconDiscord />
            </div>
            <div className="help">{discord ? null : <ConnectDiscord />}</div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={inviteFriends}
                onChange={() => {
                  const nextValue = !inviteFriends
                  setInvalidFriends(nextValue)
                  if (!nextValue) {
                    setInviteNum(0)
                  }
                }}
              />
              <span id="invite-friends-msg" className="msg">
                invite
                <input
                  title="task-invite"
                  value={inviteNum === 0 ? '' : inviteNum.toString()}
                  placeholder="X"
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (inviteFriends) setInviteNum(Number(e.target.value))
                  }}
                />
                <span>{` ${inviteNum} `}</span>
                friends to take the Task
              </span>
              <IconTip />
            </div>
          </div>
        </div>
        <div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={likeTwitter}
                onChange={() => {
                  if (!twitter) return
                  setLikeTwitter(!likeTwitter)
                  if (!likeTwitter) {
                    setLikeTwitterLink('')
                  }
                }}
              />
              <span id="like-twitter-msg" className="msg">
                Like @{twitter?.thirdpartyName || 'XXX'} on twitter
              </span>
              <IconTwitter />
            </div>
            <div className="help">
              {twitter ? (
                likeTwitter && (
                  <div className="input-box">
                    <span>Tweet Link:</span>
                    <input
                      type="text"
                      title="task-like"
                      value={likeTwitterLink}
                      onChange={(e) => setLikeTwitterLink(e.target.value)}
                    />
                  </div>
                )
              ) : (
                <ConnectTwitter />
              )}
            </div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={retweetTwitter}
                onChange={() => {
                  if (!twitter) return
                  setRetweetTwitter(!retweetTwitter)
                  if (!retweetTwitter) {
                    setRetweetTwitterLink('')
                  }
                }}
              />
              <span id="retweet-twitter-msg" className="msg">
                Retweet @{twitter?.thirdpartyName || 'XXX'} on twitter
              </span>
              <IconTwitter />
            </div>
            <div className="help">
              {twitter ? (
                retweetTwitter && (
                  <div className="input-box">
                    <span>Tweet Link</span>
                    <input
                      type="text"
                      title="retweet"
                      value={retweetTwitterLink}
                      onChange={(e) => {
                        setRetweetTwitterLink(e.target.value)
                      }}
                    />
                  </div>
                )
              ) : (
                <ConnectTwitter />
              )}
            </div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={joinCommunity}
                onChange={() => {
                  setJoinCommunity(!joinCommunity)
                }}
              />
              <span id="join-community-msg" className="msg">
                Join {account.name || 'XXX'}'s the community
              </span>
              <IconNotify />
            </div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={joinCommunityContribution}
                onChange={() => {
                  const nextValue = !joinCommunityContribution
                  setJoinCommunityContribution(nextValue)
                  if (!nextValue) {
                    setJoinCommunityContributionNum(0)
                  }
                }}
              />
              <span id="join-community-contribution-msg" className="msg">
                {account.name || 'XXX'}'s community contribution {'>'}
                <input
                  type="text"
                  title="task-join-community"
                  value={joinCommunityContributionNum === 0 ? '' : joinCommunityContributionNum.toString()}
                  placeholder="X"
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (!joinCommunityContribution) return
                    const value = Number(e.target.value)
                    setJoinCommunityContributionNum(value)
                  }}
                />
                <span>{` ${joinCommunityContributionNum} `}</span>
              </span>
              <IconTip />
            </div>
          </div>
        </div>
      </div>
    </SelectActionsBox>
  )
}

function CustomCheckBox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span
      onClick={() => {
        onChange()
      }}
    >
      {checked ? <IconCheckboxChecked /> : <IconCheckbox />}
    </span>
  )
}

function ConnectTwitter() {
  return (
    <div className="btn twitter" onClick={() => connectionSocialMedia('twitter')}>
      <TwitterIcon />
      <p>{'Connect Twitter First'}</p>
    </div>
  )
}

function ConnectDiscord() {
  return (
    <div className="btn discord" onClick={() => connectionSocialMedia('discord')}>
      <DiscordIcon />
      <p>{'Connect Discord First'}</p>
    </div>
  )
}

const SelectActionsBox = styled.div`
  & .content {
    display: flex;
    justify-content: space-between;
    > div {
      width: 580px;
      & .content-item {
        background-color: #f8f8f8;
        margin-bottom: 20px;
        padding: 10px 18px;
        /* display: flex;
        align-items: center; */

        & .desc {
          display: flex;
          align-items: center;

          & span:first-child {
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 10px;
            width: 25px;
            height: 25px;
          }
          & .msg {
            flex-grow: 1;

            > input {
              margin: 0 10px;
              border: none;
              outline: none;
              background-color: #fff;
              height: 40px;
              width: 80px;
              text-align: center;
              font-size: 14px;
              line-height: 20px;
            }

            > span {
              display: none;
            }
          }
        }

        & .help {
          margin: 0 30px;
          & div.input-box {
            background-color: #fff;
            padding: 10px;
            display: flex;
            color: rgba(51, 51, 51, 0.3);
            font-size: 14px;
            line-height: 20px;
            > input {
              flex-grow: 1;
              margin-left: 10px;
              border: none;
              outline: none;
            }
          }
        }
      }
    }
  }

  > div:last-child {
    border: none;
  }

  & div.btn {
    position: relative;
    /* border-radius: 10px; */
    cursor: pointer;
    width: 100%;
    height: 40px;
    color: #fff;
    display: flex;
    align-items: center;
    & svg {
      margin-left: 10px;
    }
    & p {
      text-align: center;
      width: 100%;
      position: absolute;
    }
  }

  & div.twitter {
    background-color: #3293f8;
  }
  & div.discord {
    background-color: #5165f6;
  }
`
