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
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import useWalletSign from '../../hooks/useWalletSign'
import PhantomIcon from './PhantomIcon'
import MetamaskIcon from './MetamaskIcon'
import ConnectModal from './ConnectModal'
import ConnectWalletModal from './ConnectWalletModal'

const ConnectedBtn = styled(Button)`
  & img {
    width: 25px;
    margin-right: 10px;
    font-size: 15px;
  }
`

const ConnectedAccountBox = styled(Box)`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 10px;
  width: 200px;
  height: 40px;
  background-color: #70e137;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  & img {
    position: absolute;
    left: 13px;
    top: 5px;
    margin-right: 15px;
    border-radius: 50%;
    height: 30px;
    width: 30px;
  }

  & span {
    color: #fff;
    width: 100%;
  }
`

export default function ConnectBtn() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)

  const handleLogout = useCallback(async () => {
    if (account.pubkey) {
      clearLoginToken(account.pubkey, account.defaultWallet)
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
              <ConnectedAccountBox {...bindTrigger(popupState)}>
                <img src={account.avatar} alt="" />
                <span>{account.name || shortPubkey}</span>
              </ConnectedAccountBox>
              {/* <ConnectedBtn variant="contained" {...bindTrigger(popupState)}>
                <Icon />
                {shortPubkey}
              </ConnectedBtn> */}
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
        <Button
          variant="contained"
          onClick={() => {
            dispatch(setConnectWalletModalShow(true))
          }}
        >
          ConnectWallet
        </Button>
      )}

      <ConnectWalletModal />
      <ConnectModal />
    </>
  )
}
