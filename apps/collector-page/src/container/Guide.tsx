import { Button, Stack } from '@mui/material'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { selectAccount, setConnectModal, ConnectModal, userOtherWalletLink } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { SIGN_MSG, TokenType } from '../utils/token'
import DiscordIcon from '../components/ConnectBtn/DiscordIcon'
import MetamaskIcon from '../components/ConnectBtn/MetamaskIcon'
import PhatomIcon from '../components/ConnectBtn/PhantomIcon'
import TwitterIcon from '../components/ConnectBtn/TwitterIcon'
import EmailIcon from '../components/ConnectBtn/EmailIcon'
import useWalletSign from '../hooks/useWalletSign'

export default function Guide() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom } = useWalletSign()

  const bindMetamask = useCallback(async () => {
    if (!phantomValid) alert('Install Metamask first')
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
  }, [metamaskValid])

  const bindPhantom = useCallback(async () => {
    if (!phantomValid) alert('Install Phantom first')
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
  }, [phantomValid])

  return (
    <GuideContainer>
      <div>
        <h1>Welcome to EnchaNFT!</h1>
        <p>To complete the task faster,please connect your account first</p>
      </div>
      <div>
        <div
          className="connect-btn"
          onClick={() => {
            dispatch(setConnectModal(ConnectModal.TWITTER))
          }}
        >
          <Stack direction="row" spacing={2}>
            <div className="label">Twitter:</div>
            <div className="btn twitter">
              <TwitterIcon />
              <p>{account?.twitter || 'Connect Twitter'}</p>
            </div>
          </Stack>
        </div>
        <div
          className="connect-btn"
          onClick={() => {
            dispatch(setConnectModal(ConnectModal.DISCORD))
          }}
        >
          <Stack direction="row" spacing={2}>
            <div className="label">Discord:</div>
            <div className="btn discord">
              <DiscordIcon />
              <p>{account?.discord || 'Connect Discord'}</p>
            </div>
          </Stack>
        </div>
        <div
          className="connect-btn"
          onClick={() => {
            dispatch(setConnectModal(ConnectModal.EMAIL))
          }}
        >
          <Stack direction="row" spacing={2}>
            <div className="label">Email:</div>
            <div className="btn email">
              <EmailIcon />
              <p>Connect Email</p>
            </div>
          </Stack>
        </div>
        <div
          className="connect-btn"
          onClick={() => {
            dispatch(setConnectModal(ConnectModal.PHANTOM))
          }}
        >
          <Stack direction="row" spacing={2}>
            <div className="label">Other Wallet:</div>
            {account.defaultWallet == TokenType.Ethereum && (
              <div className="btn wallet">
                <PhatomIcon />
                <p>Connect Phantom</p>
              </div>
            )}
            {account.defaultWallet === TokenType.Solana && (
              <div className="btn wallet">
                <MetamaskIcon />
                <p>Connect Metamask</p>
              </div>
            )}
          </Stack>
        </div>
      </div>
      <Button
        variant="contained"
        onClick={() => {
          localStorage.setItem('has-guide', 'has-guide')
          navigate('/')
        }}
      >
        skip
      </Button>
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

      & svg {
        margin-left: 30px;
      }

      & img {
        width: 30px;
        margin-left: 30px;
      }
    }
  }
`
