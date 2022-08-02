import { Checkbox } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChainType, selectAccount } from '../../../../features/user/accountSlice'
import { useAppSelector } from '../../../../store/hooks'
import { State } from './state'

export default function SelectActions({ updateStateActions }: { updateStateActions: (arg0: string[]) => void }) {
  const account = useAppSelector(selectAccount)

  const discord = account.accounts.find((item) => item.accountType === ChainType.DISCORD)
  const twitter = account.accounts.find((item) => item.accountType === ChainType.TWITTER)

  const [followTwitter, setFollowTwitter] = useState(false)
  const [joinDiscord, setJoinDiscord] = useState(false)

  useEffect(() => {
    const actions: string[] = []
    if (followTwitter) {
      const msg = document.getElementById('follow-twitter-msg')?.innerText
      msg && actions.push(msg)
    }
    if (joinDiscord) {
      const msg = document.getElementById('join-discord-msg')?.innerText
      msg && actions.push(msg)
    }
    updateStateActions(actions)
  }, [discord, twitter, followTwitter, joinDiscord])
  return (
    <SelectActionsBox>
      <h4>Select actions</h4>
      <div>
        <Checkbox
          checked={followTwitter}
          onChange={(e) => {
            setFollowTwitter(!followTwitter)
          }}
        />{' '}
        <span id="follow-twitter-msg">Follow {twitter?.thirdpartyName}'s on Twitter</span>
      </div>
      <div>
        <Checkbox checked={joinDiscord} onChange={() => setJoinDiscord(!joinDiscord)} />{' '}
        <span id="join-discord-msg">Join {discord?.thirdpartyName}'s server on Discord</span>
      </div>
      <div>
        <Checkbox defaultChecked /> invite X friends to take the Task
        <br />
        X = <input type="number" title="task-invite" />
      </div>
      <div>
        <Checkbox defaultChecked /> Like on twitter
        <br />
        Tweet link: <input type="text" title="task-like" />
      </div>
      <div>
        <Checkbox defaultChecked /> Retweet on twitter
        <br />
        Tweet link: <input type="text" title="retweet" />
      </div>
      <div>
        <Checkbox defaultChecked /> Join the community
      </div>
      <div>
        <Checkbox defaultChecked /> Join the community
        <br />
        x=
        <input type="text" title="task-join-community" />
      </div>
    </SelectActionsBox>
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
    padding: 5px 0;
    border-bottom: 1px dashed gray;
  }
  > div:last-child {
    border: none;
  }
`
