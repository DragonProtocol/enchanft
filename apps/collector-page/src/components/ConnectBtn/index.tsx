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
  resetResMessage
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import useWalletSign from '../../hooks/useWalletSign'
import PhantomIcon from './PhantomIcon'
import MetamaskIcon from './MetamaskIcon'
import ConnectModal from './ConnectModal'
import ConnectWalletModal from './ConnectWalletModal'
import { ButtonPrimary } from '../common/button/ButtonBase'
import UserAvatar from '../business/user/UserAvatar'

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
                <UserAvatar src={account.avatar} />
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

      {account.resMessage != null &&
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={!!account.resMessage.message}
          // message={account.linkErrMsg}
          autoHideDuration={5000}
          onClose={() => {
            dispatch(resetResMessage())
          }}
        >
          <Alert
            severity={account.resMessage.type}
            onClose={() => {
              dispatch(resetResMessage())
            }}
          >
            {account.resMessage.message}
          </Alert>
        </Snackbar>
      }
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
