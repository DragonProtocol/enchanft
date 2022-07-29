import { Button, Stack } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import {
  selectAccount,
  setConnectModal,
  ConnectModal,
  userOtherWalletLink,
  ChainType,
} from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { SIGN_MSG, TokenType } from '../utils/token'
import DiscordIcon from '../components/ConnectBtn/DiscordIcon'
import MetamaskIcon from '../components/ConnectBtn/MetamaskIcon'
import PhantomIcon from '../components/ConnectBtn/PhantomIcon'
import TwitterIcon from '../components/ConnectBtn/TwitterIcon'
import EmailIcon from '../components/ConnectBtn/EmailIcon'
import useWalletSign from '../hooks/useWalletSign'
import { sortPubKey } from '../utils/solana'
import { connectionSocialMedia } from '../utils/socialMedia'

export default function Guide() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const twitter = account.accounts.find((item) => item.accountType === 'TWITTER')?.thirdpartyName
  const discord = account.accounts.find((item) => item.accountType === 'DISCORD')?.thirdpartyName

  const accountPhantom = account.accounts.find((item) => item.accountType === ChainType.SOLANA)
  const accountMetamask = account.accounts.find((item) => item.accountType === ChainType.EVM)

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom } = useWalletSign()

  const bindMetamask = useCallback(async () => {
    if (!phantomValid) alert('Install Metamask first')
    if (accountMetamask) return
    const data = await signMsgWithMetamask()
    console.log(data)
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: SIGN_MSG,
      }),
    )
  }, [metamaskValid, accountMetamask])

  const bindPhantom = useCallback(async () => {
    if (!phantomValid) alert('Install Phantom first')
    if (accountPhantom) return
    const data = await signMsgWithPhantom()
    console.log(data)
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: SIGN_MSG,
      }),
    )
  }, [phantomValid, accountPhantom])

  const bindTwitter = useCallback(async () => {
    connectionSocialMedia('twitter')
  }, [])

  const bindDiscord = useCallback(async () => {
    connectionSocialMedia('discord')
  }, [])

  return (
    <GuideContainer>
      <div>
        <h1>Welcome to EnchaNFT!</h1>
        <p>To complete the task faster,please connect your account first</p>
      </div>
      <div>
        <div className="connect-btn" onClick={bindTwitter}>
          <Stack direction="row" spacing={1}>
            <div className="label">Twitter:</div>
            <div className="btn twitter">
              <TwitterIcon />
              <p>{twitter || 'Connect Twitter'}</p>
            </div>
          </Stack>
        </div>
        <div className="connect-btn" onClick={bindDiscord}>
          <Stack direction="row" spacing={1}>
            <div className="label">Discord:</div>
            <div className="btn discord">
              <DiscordIcon />
              <p>{discord || 'Connect Discord'}</p>
            </div>
          </Stack>
        </div>
        {/* <div
          className="connect-btn"
          onClick={() => {
            dispatch(setConnectModal(ConnectModal.EMAIL))
          }}
        >
          <Stack direction="row" spacing={1}>
            <div className="label">Email:</div>
            <div className="btn email">
              <EmailIcon />
              <p>Connect Email</p>
            </div>
          </Stack>
        </div> */}

        <div className="connect-btn" onClick={bindPhantom}>
          <Stack direction="row" spacing={1}>
            <div className="label">Phantom:</div>

            <div className="btn wallet">
              <PhantomIcon />
              <p>{accountPhantom ? sortPubKey(accountPhantom.thirdpartyId) : 'Connect Phantom'}</p>
            </div>
          </Stack>
        </div>

        <div className="connect-btn" onClick={bindMetamask}>
          <Stack direction="row" spacing={1}>
            <div className="label">Metamask:</div>

            <div className="btn wallet metamask">
              <MetamaskIcon />
              <p>{accountMetamask ? sortPubKey(accountMetamask.thirdpartyId) : 'Connect Metamask'}</p>
            </div>
          </Stack>
        </div>
      </div>
      <div className="skip">
        <Button
          variant="contained"
          onClick={() => {
            localStorage.setItem('has-guide', 'has-guide')
            navigate('/')
          }}
        >
          skip
        </Button>
      </div>
    </GuideContainer>
  )
}

const GuideContainer = styled.div`
  width: 600px;
  margin: 0 auto;

  & .connect-btn {
    & > div {
      margin: 40px 0;
      display: flex;
      align-items: center;

      & div.label {
        width: 120px;
        text-align: end;
      }

      & div.btn {
        position: relative;
        border-radius: 10px;
        cursor: pointer;
        width: 400px;
        height: 60px;
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
      & div.email {
        background-color: #3dd607;
      }

      & div.wallet {
        background-color: #513ac2;
      }

      & div.wallet.metamask {
        background-color: #f6851b;
      }

      & svg {
        margin-left: 30px;
      }

      & img {
        width: 30px;
        margin-left: 30px;
      }
    }
  }

  > .skip {
    margin-top: 70px;
    text-align: center;
  }
`
