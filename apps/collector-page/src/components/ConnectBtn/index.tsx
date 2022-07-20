import { Box, Button, Modal, Menu, MenuItem, styled } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

import {
  selectAccount,
  setDefaultWallet,
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

const ConnectedBtn = styled(Button)`
  & img {
    width: 25px;
    margin-right: 10px;
    font-size: 15px;
  }
`

export default function ConnectBtn() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom } = useWalletSign()

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

  const connectMetamask = useCallback(async () => {
    dispatch(setDefaultWallet(TokenType.Ethereum))
    const data = await signMsgWithMetamask()
    if (!data) {
      return
    }
    handleLogin(data)
    handleClose()
    navigateToGuide()
  }, [])
  const connectPhantom = useCallback(async () => {
    dispatch(setDefaultWallet(TokenType.Solana))
    const data = await signMsgWithPhantom()
    if (!data) {
      return
    }
    handleLogin(data)
    handleClose()
    navigateToGuide()
  }, [])
  const logout = useCallback(async () => {
    if (account.pubkey) {
      clearLoginToken(account.pubkey, account.defaultWallet)
      dispatch(setToken(''))
      dispatch(setPubkey(''))
    }
  }, [account])

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
                    logout()
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
        <Box
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
          <Button onClick={connectMetamask}>Metamask:{metamaskValid + ''}</Button>
          <Button onClick={connectPhantom}>Phantom:{phantomValid + ''}</Button>
        </Box>
      </Modal>
    </>
  )
}
