import { Box, Button, Modal, Menu, MenuItem, styled } from '@mui/material'
import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import { Close } from '@mui/icons-material'

import {
  selectAccount,
  setConnectModal,
  setAvatar,
  setDefaultWallet,
  setName,
  setPubkey,
  setToken,
  userGetProfile,
  userLogin,
  ConnectModal as ConnectModalType,
  userOtherWalletLink,
  ChainType,
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import { connectionSocialMedia } from '../../utils/socialMedia'

import useWalletSign from '../../hooks/useWalletSign'
import MetamaskIcon from './MetamaskIcon'
import PhantomIcon from './PhantomIcon'
import EmailIcon from './EmailIcon'
import DiscordIcon from './DiscordIcon'
import TwitterIcon from './TwitterIcon'

export default function ConnectModal() {
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom } = useWalletSign()
  const handleCloseConnectModal = useCallback(() => {
    dispatch(setConnectModal(null))
  }, [])

  const bindMetamask = useCallback(async () => {
    if (!metamaskValid) alert('Install Metamask first')
    const data = await signMsgWithMetamask()
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: SIGN_MSG,
      }),
    )
    handleCloseConnectModal()
  }, [metamaskValid])

  const bindPhantom = useCallback(async () => {
    if (!phantomValid) alert('Install Phantom first')
    const data = await signMsgWithPhantom()
    if (!data) return
    dispatch(
      userOtherWalletLink({
        walletType: data.walletType,
        signature: data.signature,
        pubkey: data.pubkey,
        payload: SIGN_MSG,
      }),
    )
    handleCloseConnectModal()
  }, [metamaskValid])

  useEffect(() => {
    const discord = account.accounts.find((item) => item.accountType === ChainType.DISCORD)
    const twitter = account.accounts.find((item) => item.accountType === ChainType.TWITTER)
    if (
      (discord && account.connectModal === ConnectModalType.DISCORD) ||
      (twitter && account.connectModal === ConnectModalType.TWITTER)
    ) {
      handleCloseConnectModal()
    }
  }, [account])

  const bindTwitter = useCallback(async () => {
    connectionSocialMedia('twitter')
    handleCloseConnectModal()
  }, [])

  const bindDiscord = useCallback(async () => {
    connectionSocialMedia('discord')
    handleCloseConnectModal()
  }, [])

  let btn: null | ReactElement = null
  let msg = ''
  switch (account.connectModal) {
    case ConnectModalType.METAMASK:
      btn = (
        <div className="btn wallet" onClick={bindMetamask}>
          <MetamaskIcon />
          <p>Connect Metamask</p>
        </div>
      )
      msg = `Metamask  is not connected. Please connect Metamask.`
      break
    case ConnectModalType.PHANTOM:
      btn = (
        <div className="btn wallet" onClick={bindPhantom}>
          <PhantomIcon />
          <p>Connect Phantom</p>
        </div>
      )
      msg = `Phantom  is not connected. Please connect Phantom.`
      break
    case ConnectModalType.TWITTER:
      btn = (
        <div className="btn twitter" onClick={bindTwitter}>
          <TwitterIcon />
          <p>Connect Twitter</p>
        </div>
      )
      msg = `Twitter account is not connected. Please connect your Twitter account.`
      break
    case ConnectModalType.DISCORD:
      btn = (
        <div className="btn discord" onClick={bindDiscord}>
          <DiscordIcon />
          <p>Connect Discord</p>
        </div>
      )
      msg = `Discord account is not connected. Please connect your Discord account.`
      break
    case ConnectModalType.EMAIL:
      btn = (
        <div className="btn email">
          <EmailIcon />
          <p>Connect Email</p>
        </div>
      )
      msg = `Email account is not connected. Please connect your Email account.`
      break

    default:
      break
  }

  return (
    <ConnectModalBox
      open={!!account.connectModal}
      onClose={handleCloseConnectModal}
      sx={{
        zIndex: 100,
      }}
    >
      <ConnectBox
        sx={{
          position: 'absolute' as 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="close">
          <Button onClick={handleCloseConnectModal}>
            <Close />
          </Button>
        </div>
        <div className="title">
          <h1>Connect your account</h1>
        </div>
        <div className="intro">{msg}</div>
        {btn}
      </ConnectBox>
    </ConnectModalBox>
  )
}

const ConnectBox = styled(Box)`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  outline: none !important;
  position: relative;

  & div.title {
    & h1 {
      margin: 0;
    }
  }
  & div.intro {
    margin: 15px 0 35px 0;
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
    justify-content: center;

    & p {
      margin: 0 10px;
    }

    & svg {
      margin-left: 30px;
    }

    & img {
      width: 30px;
      margin-left: 30px;
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

  & div.close {
    position: absolute;
    right: 0;
    top: 0;
    margin: 10px;
  }
`

const ConnectModalBox = styled(Modal)`
  backdrop-filter: blur(12px);
`
