import { Box, Button, Modal, Menu, MenuItem, styled } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import AvatarDefault from '../imgs/avatar.png'

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
  ChainType,
  setConnectWalletModalShow,
  userOtherWalletLink,
  ConnectModal,
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import useWalletSign from '../../hooks/useWalletSign'
import IconMetamask from '../common/icons/PngIconMetaMask'
import IconPhantom from '../common/icons/IconPhantomWhite'

export default function ConnectWalletModal() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const [showNewAccountBtn, setShowNewAccountBtn] = useState(false)
  const [newAccountWith, setNewAccountWith] = useState<TokenType>()

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom, getMetamaskAddr, getPhantomAddr } =
    useWalletSign()

  useEffect(() => {
    if (!account.pubkey) {
      return
    }
    if (account.pubkey) {
      const existToken = getLoginToken(account.pubkey, account.defaultWallet)
      if (existToken) {
        dispatch(setToken(existToken))
        dispatch(userGetProfile())
      }
    }
  }, [account.pubkey, account.defaultWallet])

  const handleLogin = async ({
    walletType,
    pubkey,
    signature,
  }: {
    walletType: TokenType
    pubkey: string
    signature: string
  }) => {
    dispatch(
      userLogin({
        signature,
        payload: SIGN_MSG,
        pubkey,
        walletType,
      }),
    )
  }

  const handleClose = () => {
    console.log('handleClose')
    setShowNewAccountBtn(false)
    setNewAccountWith(undefined)
    dispatch(setConnectWalletModalShow(false))
  }

  const navigateToGuide = useCallback(() => {
    if (localStorage.getItem(`has-guide-${account.id}`)) return
    if (localStorage.getItem(`has-finish-${account.id}`)) return
    const accountPhantom = account.accounts.find((item) => item.accountType === ChainType.SOLANA)
    const accountMetamask = account.accounts.find((item) => item.accountType === ChainType.EVM)
    const twitter = account.accounts.find((item) => item.accountType === ChainType.TWITTER)
    const discord = account.accounts.find((item) => item.accountType === ChainType.DISCORD)
    if (accountPhantom && accountMetamask && twitter && discord) return

    navigate('/guide')
  }, [account])

  const handleSign = async (data: { walletType: TokenType; pubkey: string; signature: string }) => {
    handleLogin(data)
    // dispatch(setDefaultWallet(walletType))
    dispatch(setPubkey(data.pubkey))
    handleClose()
    navigateToGuide()
  }

  const connectMetamask = useCallback(async () => {
    const pubkey = await getMetamaskAddr()
    if (!pubkey) return
    if (account.lastLoginType === TokenType.Solana) {
      setShowNewAccountBtn(true)
      setNewAccountWith(TokenType.Ethereum)
    } else {
      signMsgWithMetamask().then((data) => {
        if (!data) {
          return
        }
        handleSign(data)
      })
    }
  }, [account])

  const connectPhantom = useCallback(async () => {
    const pubkey = await getPhantomAddr()
    if (!pubkey) return
    if (account.lastLoginType === TokenType.Ethereum) {
      setShowNewAccountBtn(true)
      setNewAccountWith(TokenType.Solana)
    } else {
      signMsgWithPhantom().then((data) => {
        if (!data) {
          return
        }
        handleSign(data)
      })
    }
  }, [account])

  const createNewAccount = useCallback(async () => {
    if (newAccountWith === TokenType.Ethereum) {
      const pubkey = await getMetamaskAddr()
      if (!pubkey) return
      signMsgWithMetamask().then((data) => {
        if (!data) {
          return
        }
        handleSign(data)
      })
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr()
      if (!pubkey) return
      signMsgWithPhantom().then((data) => {
        if (!data) {
          return
        }
        handleSign(data)
      })
    }
  }, [newAccountWith])

  const loginWithLastLogin = useCallback(async () => {
    if (newAccountWith === TokenType.Ethereum) {
      const pubkey = await getMetamaskAddr()
      if (!pubkey) return
      const data = await signMsgWithPhantom()
      if (!data) {
        return
      }
      handleLogin(data)
      // dispatch(setDefaultWallet(TokenType.Ethereum))
      dispatch(setPubkey(data.pubkey))
      const newData = await signMsgWithMetamask()
      if (!newData) return
      dispatch(
        userOtherWalletLink({
          walletType: newData.walletType,
          signature: newData.signature,
          pubkey: newData.pubkey,
          payload: SIGN_MSG,
        }),
      )
      handleClose()
      navigateToGuide()
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr()
      if (!pubkey) return
      const data = await signMsgWithMetamask()
      if (!data) {
        return
      }
      handleLogin(data)
      // dispatch(setDefaultWallet(TokenType.Solana))
      dispatch(setPubkey(data.pubkey))
      const newData = await signMsgWithPhantom()
      if (!newData) return
      dispatch(
        userOtherWalletLink({
          walletType: newData.walletType,
          signature: newData.signature,
          pubkey: newData.pubkey,
          payload: SIGN_MSG,
        }),
      )
      handleClose()
      navigateToGuide()
    }
  }, [newAccountWith])

  let walletElem = (
    <>
      <div onClick={connectPhantom} className={phantomValid ? 'phantom' : 'phantom invalid'}>
        <div className="btn">
          <IconPhantom />
          <p>Phantom</p>
        </div>
        <p className="last-time">{account.lastLoginType === TokenType.Solana ? `(Last Time)` : ''}</p>
      </div>
      <div onClick={connectMetamask} className={metamaskValid ? 'metamask' : 'metamask invalid'}>
        <div className="btn">
          <IconMetamask />
          <p>MetaMask</p>
        </div>
        <p className="last-time">{account.lastLoginType === TokenType.Ethereum ? `(Last Time)` : ''}</p>
      </div>
    </>
  )

  if (newAccountWith === TokenType.Solana) {
    walletElem = (
      <div className="phantom-select">
        <div>
          <IconPhantom />
        </div>
        <p>Solana</p>
      </div>
    )
  }
  if (newAccountWith === TokenType.Ethereum) {
    walletElem = (
      <div className="metamask-select">
        <div>
          <IconMetamask />
        </div>
        <p>MetaMask</p>
      </div>
    )
  }

  return (
    <Modal
      open={account.connectWalletModalShow}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        zIndex: 100,
      }}
    >
      <ConnectBox
        sx={{
          position: 'absolute' as 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 384,
          bgcolor: 'background.paper',
          boxShadow: 24,
          py: '20px',
          px: 0,
          borderRadius: '10px',
        }}
      >
        <div className="title">
          <p>Connect Wallet</p>
        </div>
        <div className="wallet">{walletElem}</div>
        {showNewAccountBtn && (
          <div className="new-account">
            <button className="last" onClick={() => loginWithLastLogin()}>
              Connect With <img src={account.lastLoginInfo.avatar || AvatarDefault} alt="" />{' '}
              {account.lastLoginInfo.name}
            </button>
            <button className="new" onClick={createNewAccount}>
              Create New Account
            </button>
          </div>
        )}
      </ConnectBox>
    </Modal>
  )
}

const ConnectBox = styled(Box)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  /* border-radius: 10px; */
  & .title {
    padding: 0 20px;
    margin-bottom: 20px;
    > p {
      margin: 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #333333;
    }
  }
  & .wallet {
    & > .phantom-select {
      > div {
        padding: 4px 6px 0 6px;
        border-radius: 10px;
        background: #551ff4;
      }
    }
    & > .metamask-select,
    & > .phantom-select {
      height: 120px;
      display: flex;
      flex-direction: column;

      > p {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
      }
    }
  }
  & .wallet {
    display: flex;
    justify-content: space-evenly;
    > div.invalid {
      background-color: lightgray;
      cursor: not-allowed;
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      width: 160px;
      height: 160px;
      /* padding: 10px; */
      text-align: center;
      color: #fff;
      cursor: pointer;
      position: relative;

      & svg {
        width: 50px;
        height: 50px;
      }
      & p {
        margin: 10px;
      }

      & div.btn {
        & p {
          margin: 0;
          font-weight: 700;
          font-size: 18px;
          line-height: 27px;
          color: #ffffff;
        }
      }

      & p.last-time {
        margin: 0;
        position: absolute;
        bottom: 12px;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #ffffff;
      }
    }

    > div.phantom {
      border-radius: 10px;
      background: #551ff4;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
    }
    > div.metamask {
      border-radius: 10px;
      background: #f6851b;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      & svg,
      & img {
        padding: 3px;
        background-color: #fff;
        border-radius: 50%;
      }
    }
  }
  & .new-account {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 20px;
    > button {
      border: none;
      outline: none;
      margin: 5px auto;
      cursor: pointer;
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      width: 344px;
      height: 48px;
    }

    > button.last {
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      color: #ffffff;

      > img {
        width: 20px;
        height: 20px;
        vertical-align: text-top;
      }
    }

    > button.new {
      background: #ebeee4;
      color: #333333;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    }
  }
`

const HelpBtn = styled(Button)`
  background-color: #3dd606;
  text-transform: none;
  &:hover {
    background-color: #3dd606;
  }
`
