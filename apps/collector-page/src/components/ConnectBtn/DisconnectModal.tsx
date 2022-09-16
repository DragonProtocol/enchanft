import { Box, Button, Modal, Menu, MenuItem } from '@mui/material'
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
  resetLoginStatus,
  ChainType,
  setConnectWalletModalShow,
  userOtherWalletLink,
  ConnectModal,
  userUnlink,
} from '../../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearLoginToken, getLoginToken, SIGN_MSG, TokenType } from '../../utils/token'
import useWalletSign from '../../hooks/useWalletSign'
import IconMetamask from '../common/icons/PngIconMetaMask'
import PngIconCongratulate from '../common/icons/PngIconCongratulate'
import IconPhantom from '../common/icons/IconPhantomWhite'
import { AsyncRequestStatus } from '../../types'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import { MOBILE_BREAK_POINT } from '../../constants'

enum LoginStatus {
  INIT = 'init',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export default function DisconnectModal(props) {
  const dispatch = useAppDispatch()
  const { modalShow, setModalShow, type } = props

  const handleClose = () => {
    setModalShow(false)
  }

  const handleUnlink = async () => {
    // dispatch(setDefaultWallet(walletType))
    dispatch(userUnlink({ type }))
    handleClose()
  }

  return (
    <>
      <WalletModal open={modalShow}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '335px' : '540px',
            boxShadow: 24,
            px: 0,
            background: '#F7F9F1',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <ModalBox>
            <h3>Disconnect</h3>
            <p>This Discord account cannot be connected within 24h after disconnection.</p>
            <div className="btns">
              <button className="close" onClick={() => handleClose()}>
                Cancel
              </button>
              <button className="confirm" onClick={() => handleUnlink()}>
                Still to Disconnect
              </button>
            </div>
          </ModalBox>
        </Box>
      </WalletModal>
    </>
  )
}

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f7f9f1;
  & h3 {
    margin: 0;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }
  & p {
    margin: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      font-size: 14px;
      line-height: 21px;
    }
  }

  & .btns {
    display: flex;
    gap: 20px;
    justify-content: end;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      justify-content: space-between;
    }
    & button {
      padding: 10px 18px;
      gap: 10px;
      width: 120px;
      height: 48px;
      outline: none;
      border: none;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 16px;
        line-height: 24px;
      }
    }
    & .close {
      background: #ebeee4;
      color: #333333;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      cursor: pointer;
    }

    & .confirm {
      width: auto;
      background: #ff2222;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      cursor: pointer;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        white-space: nowrap;
      }
    }
  }

  &.welcome {
    background: #fffbdb;
    padding: 40px 20px;
    text-align: center;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      & img {
        width: 120px;
        height: 120px;
      }
    }
  }
`

const WalletModal = styled(Modal)`
  backdrop-filter: blur(12px);
`

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
