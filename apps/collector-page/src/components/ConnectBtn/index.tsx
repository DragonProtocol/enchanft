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
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import useWalletSign from '../../hooks/useWalletSign'
import PhantomIcon from './PhantomIcon'
import MetamaskIcon from './MetamaskIcon'
import ConnectModal from './ConnectModal'

const ConnectedBtn = styled(Button)`
  & img {
    width: 25px;
    margin-right: 10px;
    font-size: 15px;
  }
`

const ConnectBox = styled(Box)`
  display: flex;
  border-radius: 10px;
  & > div {
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
`

export default function ConnectBtn() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

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
      } else {
        if (account.defaultWallet === TokenType.Ethereum) {
          signMsgWithMetamask().then((data) => {
            if (!data) {
              return
            }
            handleLogin(data)
          })
        }
        if (account.defaultWallet === TokenType.Solana) {
          signMsgWithPhantom().then((data) => {
            if (!data) {
              return
            }
            handleLogin(data)
          })
        }
      }
    }
  }, [account.pubkey, account.defaultWallet])

  const navigateToGuide = () => {
    if (!localStorage.getItem('has-guide')) {
      navigate('/guide')
    }
  }

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
    navigateToGuide()
  }
  const handleLogout = useCallback(async () => {
    if (account.pubkey) {
      clearLoginToken(account.pubkey, account.defaultWallet)
      dispatch(setToken(''))
      dispatch(setPubkey(''))
      dispatch(setAvatar(''))
      dispatch(setName(''))
    }
  }, [account])

  const connectMetamask = useCallback(async () => {
    const pubkey = await getMetamaskAddr()
    if (!pubkey) return
    dispatch(setDefaultWallet(TokenType.Ethereum))
    dispatch(setPubkey(pubkey))
    handleClose()
    navigateToGuide()
  }, [])
  const connectPhantom = useCallback(async () => {
    const pubkey = await getPhantomAddr()
    if (!pubkey) return
    dispatch(setDefaultWallet(TokenType.Solana))
    dispatch(setPubkey(pubkey))
    handleClose()
    navigateToGuide()
  }, [])

  const shortPubkey = useMemo(() => {
    if (account.pubkey) {
      return account.pubkey.slice(0, 4) + '..' + account.pubkey.slice(-4)
    }
    return ''
  }, [account.pubkey])

  const Icon = account.defaultWallet === TokenType.Solana ? PhantomIcon : MetamaskIcon

  return (
    <>
      {(shortPubkey && account.token && (
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <ConnectedBtn variant="contained" {...bindTrigger(popupState)}>
                <Icon />
                {shortPubkey}
              </ConnectedBtn>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    popupState.close()
                    navigate('/profile')
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close()
                    handleLogout()
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
      )) || (
        <Button variant="contained" onClick={handleOpen}>
          ConnectWallet
        </Button>
      )}
      <Modal
        open={open}
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
          <div onClick={connectMetamask}>
            <MetamaskIcon />
            <p>Metamask</p>
          </div>

          <div onClick={connectPhantom}>
            <PhantomIcon />
            <p>Phantom</p>
          </div>
        </ConnectBox>
      </Modal>
      <ConnectModal />
    </>
  )
}
