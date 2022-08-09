import { Button, Checkbox } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

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
import { checkTwitterNameValid } from '../../../../services/api/task'

export default function SelectActions({
  followTwitters,
  updateStateActions,
  updateStateFollowTwitters,
}: {
  followTwitters: string[]
  updateStateActions: (arg0: Action[]) => void
  updateStateFollowTwitters: (arg0: string[]) => void
}) {
  const account = useAppSelector(selectAccount)

  const discord = account.accounts.find((item) => item.accountType === ChainType.DISCORD)
  const twitter = account.accounts.find((item) => item.accountType === ChainType.TWITTER)

  const [followTwitter, setFollowTwitter] = useState(false)
  const [followTwitterLinkResult, setFollowTwitterLinkResult] = useState<Array<string>>(
    followTwitters.length > 0 ? [...followTwitters] : twitter ? [twitter.thirdpartyName] : [],
  )
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
    const actions: Action[] = []
    if (followTwitter) {
      actions.push({
        name: `Follow @${followTwitterLinkResult.join('@')} on Twitter`,
        type: ActionType.TWITTER,
        typeMore: ActionTypeMore.FOLLOW_TWITTER,
        description: '',
      })
      updateStateFollowTwitters(followTwitterLinkResult)
    } else if (twitter) {
      updateStateFollowTwitters([twitter.thirdpartyName])
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
    followTwitterLinkResult,
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

  console.log(followTwitterLinkResult, followTwitters)

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
                Follow this account on Twitter
              </span>
              <IconTwitter />
            </div>
            {twitter ? (
              <>
                {followTwitter && (
                  <>
                    <TwitterFollowed
                      followTwitterLinkResult={followTwitterLinkResult}
                      updateTwitterLinkResult={(data) => {
                        setFollowTwitterLinkResult(data)
                      }}
                    />
                    {followTwitterLinkResult.length < 5 && (
                      <AddTwitterToFollowed
                        followTwitterLinkResult={followTwitterLinkResult}
                        addValid={(data) => {
                          setFollowTwitterLinkResult([...followTwitterLinkResult, data])
                        }}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="help">
                <ConnectTwitter />
              </div>
            )}
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

function TwitterFollowed({
  followTwitterLinkResult,
  updateTwitterLinkResult,
}: {
  followTwitterLinkResult: string[]
  updateTwitterLinkResult: (arg0: string[]) => void
}) {
  return (
    <>
      {followTwitterLinkResult.map((item, index) => {
        return (
          <div className="help" key={item + index}>
            <div className="input-box">
              <span>Username: @</span>
              <input type="text" title="task-like" value={item} onChange={() => {}} />
              <CheckIcon />
            </div>

            <DeleteForeverIcon
              onClick={() => {
                const before = followTwitterLinkResult.slice(0, index)
                const after = followTwitterLinkResult.slice(index + 1)
                updateTwitterLinkResult([...before, ...after])
              }}
            />
          </div>
        )
      })}
    </>
  )
}

function AddTwitterToFollowed({
  addValid,
  followTwitterLinkResult,
}: {
  addValid: (arg0: string) => void
  followTwitterLinkResult: string[]
}) {
  const timerRef = useRef<NodeJS.Timeout>()
  const [data, setData] = useState('')
  const [checked, setChecked] = useState(false)
  const [dataValid, setDataValid] = useState(false)

  const checkValid = async (data: string) => {
    if (!data) return
    console.log('checkTwitterNameValid:', { data })
    try {
      await checkTwitterNameValid(data)
      setDataValid(true)
    } catch (error) {
      setDataValid(true)
    } finally {
      setChecked(true)
    }
  }

  const reset = () => {
    setData('')
    setChecked(false)
    setDataValid(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="help">
      <div className="input-box">
        <span>Username: @</span>
        <input
          type="text"
          title="task-like"
          value={data}
          onChange={(e) => {
            const dataValue = e.target.value
            setData(dataValue)
            if (timerRef.current) {
              clearTimeout(timerRef.current)
            }
            timerRef.current = setTimeout(() => {
              checkValid(dataValue)
            }, 1000)
          }}
        />
        {checked ? (dataValid && <CheckIcon />) || <CloseIcon /> : null}
      </div>

      <AddIcon
        className={!dataValid ? 'invalid-icon' : ''}
        onClick={() => {
          if (!dataValid) return
          if (followTwitterLinkResult.length >= 5) return
          addValid(data)
          reset()
        }}
      />
    </div>
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
      width: 540px;
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
          margin: 0 0 5px 30px;
          display: flex;
          align-items: center;
          & div.input-box {
            flex-grow: 1;
            background-color: #fff;
            padding: 10px;
            display: flex;
            color: rgba(51, 51, 51, 0.3);
            font-size: 14px;
            line-height: 20px;
            > input {
              flex-grow: 1;
              border: none;
              outline: none;
            }
          }
          & svg {
            cursor: pointer;
          }

          & .invalid-icon {
            cursor: not-allowed;
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
