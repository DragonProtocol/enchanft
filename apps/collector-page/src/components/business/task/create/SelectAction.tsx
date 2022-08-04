import { Button, Checkbox } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChainType, selectAccount } from '../../../../features/user/accountSlice'
import { useAppSelector } from '../../../../store/hooks'
import { Action, ActionType, ActionTypeMore, State } from './state'
import { connectionSocialMedia } from '../../../../utils/socialMedia'
import TwitterIcon from '../../../ConnectBtn/TwitterIcon'
import DiscordIcon from '../../../ConnectBtn/DiscordIcon'

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
      const msg = document.getElementById('follow-twitter-msg')?.innerText
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
      const msg = document.getElementById('join-discord-msg')?.innerText
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
      const msg = document.getElementById('invite-friends-msg')?.innerText
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
      const msg = document.getElementById('invite-discord-msg')?.innerText
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
      const msg = document.getElementById('like-twitter-msg')?.innerText
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
      const msg = document.getElementById('retweet-twitter-msg')?.innerText
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
      const msg = document.getElementById('join-community-msg')?.innerText
      msg &&
        actions.push({
          name: msg,
          type: ActionType.NOTIFY,
          typeMore: ActionTypeMore.TURN_ON_NOTIFICATION,
          description: '',
        })
    }
    if (joinCommunityContribution && joinCommunityContributionNum) {
      const msg = document.getElementById('join-community-contribution-msg')?.innerText
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
      <h4>Select actions</h4>
      <div>
        <Checkbox
          checked={followTwitter}
          onChange={(e) => {
            if (twitter) setFollowTwitter(!followTwitter)
          }}
        />{' '}
        <span id="follow-twitter-msg">Follow @{twitter?.thirdpartyName || 'XXX'} on Twitter</span>
        <br />
        {twitter ? (
          followTwitter && (
            <div className="input-box">
              Tweet link:{' '}
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
      <div>
        <Checkbox
          checked={joinDiscord}
          onChange={() => {
            if (discord) setJoinDiscord(!joinDiscord)
          }}
        />{' '}
        <span id="join-discord-msg">Join #{discord?.thirdpartyName || 'XXX'} server on Discord</span>
        <br />
        {discord ? (
          joinDiscord && (
            <>
              <div className="input-box">
                discord server link:{' '}
                <input
                  type="text"
                  title="task-like"
                  value={joinDiscordLink}
                  onChange={(e) => setJoinDiscordLink(e.target.value)}
                />
              </div>
              <div className="input-box">
                discord server id:{' '}
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
      <div>
        <Checkbox
          checked={inviteDiscord}
          onChange={() => {
            if (discord) setInviteDiscord(!inviteDiscord)
          }}
        />{' '}
        <span id="invite-discord-msg">
          Invite {inviteDiscordNum || 'X'} friends to join #{discord?.thirdpartyName || 'XXX'} server on Discord
        </span>
        <br />
        {discord ? (
          inviteDiscord && (
            <div>
              X ={' '}
              <input
                type="number"
                title="invite-discord"
                value={inviteDiscordNum === 0 ? '' : inviteDiscordNum.toString()}
                min="1"
                step="1"
                onKeyPress={numberInput}
                onChange={(e) => {
                  setInviteDiscordNum(Number(e.target.value))
                }}
              />
            </div>
          )
        ) : (
          <ConnectDiscord />
        )}
      </div>
      <div>
        <Checkbox
          checked={inviteFriends}
          onChange={() => {
            const nextValue = !inviteFriends
            setInvalidFriends(nextValue)
            if (!nextValue) {
              setInviteNum(0)
            }
          }}
        />{' '}
        <span id="invite-friends-msg">invite {inviteNum || 'X'} friends to take the Task</span>
        <br />
        {inviteFriends && (
          <div>
            X ={' '}
            <input
              type="number"
              title="task-invite"
              value={inviteNum === 0 ? '' : inviteNum.toString()}
              min="1"
              step="1"
              onKeyPress={numberInput}
              onChange={(e) => {
                setInviteNum(Number(e.target.value))
              }}
            />
          </div>
        )}
      </div>
      <div>
        <Checkbox
          checked={likeTwitter}
          onChange={() => {
            if (!twitter) return
            setLikeTwitter(!likeTwitter)
            if (!likeTwitter) {
              setLikeTwitterLink('')
            }
          }}
        />{' '}
        <span id="like-twitter-msg">Like @{twitter?.thirdpartyName || 'XXX'} on twitter</span>
        <br />
        {twitter ? (
          likeTwitter && (
            <div className="input-box">
              Tweet link:{' '}
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
      <div>
        <Checkbox
          checked={retweetTwitter}
          onChange={() => {
            if (!twitter) return
            setRetweetTwitter(!retweetTwitter)
            if (!retweetTwitter) {
              setRetweetTwitterLink('')
            }
          }}
        />{' '}
        <span id="retweet-twitter-msg">Retweet @{twitter?.thirdpartyName || 'XXX'} on twitter</span>
        <br />
        {twitter ? (
          retweetTwitter && (
            <div className="input-box">
              Tweet link:{' '}
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
      <div>
        <Checkbox
          checked={joinCommunity}
          onChange={() => {
            setJoinCommunity(!joinCommunity)
          }}
        />{' '}
        <span id="join-community-msg">Join {account.name || 'XXX'}'s the community</span>
      </div>
      <div>
        <Checkbox
          checked={joinCommunityContribution}
          onChange={() => {
            const nextValue = !joinCommunityContribution
            setJoinCommunityContribution(nextValue)
            if (!nextValue) {
              setJoinCommunityContributionNum(0)
            }
          }}
        />{' '}
        <span id="join-community-contribution-msg">
          {account.name || 'XXX'}'s community contribution {'>'} {joinCommunityContributionNum || 'X'}
        </span>
        <br />
        {joinCommunityContribution && (
          <div>
            X ={' '}
            <input
              type="text"
              title="task-join-community"
              value={joinCommunityContributionNum === 0 ? '' : joinCommunityContributionNum.toString()}
              min="1"
              step="1"
              onKeyPress={numberInput}
              onChange={(e) => {
                const value = Number(e.target.value)
                setJoinCommunityContributionNum(value)
              }}
            />
          </div>
        )}
      </div>
    </SelectActionsBox>
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
  & span {
    padding: 0;
  }
  & h4 {
    margin-bottom: 0;
  }
  > div {
    margin: 5px 0;
    padding: 8px 0 13px 0;
    border-bottom: 1px dashed gray;
  }
  > div:last-child {
    border: none;
  }

  & div.input-box {
    display: flex;
    > input {
      flex-grow: 1;
    }
  }

  & div.btn {
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    width: 400px;
    height: 40px;
    color: #fff;
    display: flex;
    align-items: center;

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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTc0NTgxMjMxNCwiaWF0IjoxNjU5NDEyMzE0fQ.O_207_zpaaNx4DXBvEAVs9rZkxrzNsZ7AvH3KDIZk8M
