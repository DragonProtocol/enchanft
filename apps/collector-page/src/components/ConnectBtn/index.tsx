import { Box, Button, Modal, Menu, MenuItem, styled, Snackbar, Alert } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

import {
  selectAccount,
  setLastLogin,
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
  resetLinkErrMsg,
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import useWalletSign from '../../hooks/useWalletSign'
import PhantomIcon from './PhantomIcon'
import MetamaskIcon from './MetamaskIcon'
import ConnectModal from './ConnectModal'
import ConnectWalletModal from './ConnectWalletModal'
import { ButtonPrimary } from '../common/button/ButtonBase'
import AvatarDefaultImg from '../imgs/avatar.png'

export default function ConnectBtn() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

  const handleLogout = useCallback(async () => {
    if (account.pubkey) {
      clearLoginToken(account.pubkey, account.defaultWallet)
      dispatch(setLastLogin(account.defaultWallet))
      dispatch(setToken(''))
      dispatch(setPubkey(''))
      dispatch(setAvatar(''))
      dispatch(setName(''))
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
              <ConnectBtnWrapper {...bindTrigger(popupState)}>
                <img src={account.avatar || AvatarDefaultImg} alt="" />
                {account.name || shortPubkey}
              </ConnectBtnWrapper>
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
        <ConnectBtnWrapper
          onClick={() => {
            dispatch(setConnectWalletModalShow(true))
          }}
        >
          Connect Wallet
        </ConnectBtnWrapper>
      )}

      <ConnectWalletModal />
      <ConnectModal />

      {/** LinkErrMsg */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={!!account.linkErrMsg}
        // message={account.linkErrMsg}
        autoHideDuration={5000}
        onClose={() => {
          dispatch(resetLinkErrMsg())
        }}
      >
        <Alert
          severity="error"
          onClose={() => {
            dispatch(resetLinkErrMsg())
          }}
        >
          {account.linkErrMsg}
        </Alert>
      </Snackbar>
    </>
  )
}
const ConnectBtnWrapper = styled(ButtonPrimary)`
  height: 48px;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #ffffff;
  & img {
    width: 25px;
    margin-right: 10px;
    font-size: 15px;
  }
`
