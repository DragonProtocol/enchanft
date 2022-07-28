import { Box, Button, Modal, Menu, MenuItem, styled } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

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
import PhantomIcon from './PhantomIcon'
import MetamaskIcon from './MetamaskIcon'

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
    dispatch(setConnectWalletModalShow(false))
  }

  const navigateToGuide = useCallback(() => {
    if (localStorage.getItem('has-guide')) return
    const accountPhantom = account.accounts.find((item) => item.accountType === ChainType.SOLANA)
    const accountMetamask = account.accounts.find((item) => item.accountType === ChainType.EVM)
    const twitter = account.accounts.find((item) => item.accountType === ChainType.TWITTER)
    const discord = account.accounts.find((item) => item.accountType === ChainType.DISCORD)
    if (accountPhantom && accountMetamask && twitter && discord) return

    navigate('/guide')
  }, [account])

  const handleSign = async (
    data: {
      walletType: TokenType
      pubkey: string
      signature: string
    },
    walletType: TokenType,
  ) => {
    handleLogin(data)
    dispatch(setDefaultWallet(walletType))
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
        handleSign(data, TokenType.Ethereum)
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
        handleSign(data, TokenType.Solana)
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
        handleSign(data, TokenType.Ethereum)
      })
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr()
      if (!pubkey) return
      signMsgWithPhantom().then((data) => {
        if (!data) {
          return
        }
        handleSign(data, TokenType.Solana)
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
      dispatch(setDefaultWallet(TokenType.Ethereum))
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
      dispatch(setDefaultWallet(TokenType.Solana))
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
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="wallet">
          <div onClick={connectMetamask} className={metamaskValid ? '' : 'invalid'}>
            <MetamaskIcon />
            <p>Metamask{account.lastLoginType === TokenType.Ethereum ? `(lastUsed)` : ''}</p>
          </div>

          <div onClick={connectPhantom} className={phantomValid ? '' : 'invalid'}>
            <PhantomIcon />
            <p>Phantom{account.lastLoginType === TokenType.Solana ? `(lastUsed)` : ''}</p>
          </div>
        </div>
        {showNewAccountBtn && (
          <div className="new-account">
            <Button variant="contained" onClick={createNewAccount}>
              Create New Account With {newAccountWith}
            </Button>
            <Button variant="contained" onClick={() => loginWithLastLogin()}>
              Login With LastLogin
            </Button>
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
  border-radius: 10px;
  & .wallet {
    display: flex;
    > div.invalid {
      background-color: lightgray;
      cursor: not-allowed;
    }
    > div {
      width: 50%;
      margin: 10px 20px;
      padding: 10px;
      text-align: center;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      cursor: pointer;
      & img {
        width: 50px;
      }
      & p {
        margin: 10px;
      }
    }
  }
  & .new-account {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 20px;
    > button {
      margin: 5px 20px;
    }
  }
`
