import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import {
  selectAccount,
  setConnectModal,
  ConnectModal,
  userOtherWalletLink,
  ChainType,
  userUpdateProfile,
} from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { SIGN_MSG, TokenType } from '../utils/token'
import DiscordIcon from '../components/ConnectBtn/DiscordIcon'
import MetamaskIcon from '../components/ConnectBtn/MetamaskIcon'
import PhantomIcon from '../components/ConnectBtn/PhantomIcon'
import TwitterIcon from '../components/ConnectBtn/TwitterIcon'
import EmailIcon from '../components/ConnectBtn/EmailIcon'
import useWalletSign from '../hooks/useWalletSign'
import AddIcon from '../components/common/icons/PngIconAdd'
import { sortPubKey } from '../utils/solana'
import { connectionSocialMedia } from '../utils/socialMedia'
import { uploadAvatar } from '../services/api/login'
import { toast } from 'react-toastify'
import { AVATAR_SIZE_LIMIT } from '../constants'
import { Box, CircularProgress, Modal } from '@mui/material'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '10px',
  textAlign: 'center',
  outline: 'none',
}

export default function Guide() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const account = useAppSelector(selectAccount)
  const [modalOpen, setModalOpen] = useState(false)

  const twitter = account.accounts.find((item) => item.accountType === 'TWITTER')?.thirdpartyName
  const discord = account.accounts.find((item) => item.accountType === 'DISCORD')?.thirdpartyName

  const accountPhantom = account.accounts.find((item) => item.accountType === ChainType.SOLANA)
  const accountMetamask = account.accounts.find((item) => item.accountType === ChainType.EVM)

  const { phantomValid, metamaskValid, signMsgWithMetamask, signMsgWithPhantom } = useWalletSign()
  const [select, setSelect] = useState('tab1')
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')

  const bindMetamask = useCallback(async () => {
    if (!phantomValid) alert('Install Metamask first')
    if (accountMetamask) return
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
  }, [metamaskValid, accountMetamask])

  const bindPhantom = useCallback(async () => {
    if (!phantomValid) alert('Install Phantom first')
    if (accountPhantom) return
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
  }, [phantomValid, accountPhantom])

  const bindTwitter = useCallback(async () => {
    connectionSocialMedia('twitter')
  }, [])

  const bindDiscord = useCallback(async () => {
    connectionSocialMedia('discord')
  }, [])

  const avatarIn = avatar || account.avatar
  return (
    <GuideContainer>
      <div className="title">
        <h1>Welcome to EnchaNFT!</h1>
        <p>To complete the task faster,please connect your account first</p>
      </div>
      <div className="tabs">
        <div className={select === 'tab1' ? 'active' : ''} onClick={() => setSelect('tab1')}>
          <h3>Step 1</h3>
          <p>Connect Your Account</p>
        </div>
        <div className={select === 'tab2' ? 'active' : ''} onClick={() => setSelect('tab2')}>
          <h3>Step 2</h3>
          <p>Edit Your Profile</p>
        </div>
      </div>
      {select === 'tab1' && (
        <div>
          <div className="connections">
            <div className="connect-btn twitter" onClick={bindTwitter}>
              <TwitterIcon />
              <p>{twitter || 'Connect Twitter'}</p>
            </div>
            <div className="connect-btn discord" onClick={bindDiscord}>
              <DiscordIcon />
              <p>{discord || 'Connect Discord'}</p>
            </div>
            {/* <div
              className="connect-btn email"
              onClick={() => {
                dispatch(setConnectModal(ConnectModal.EMAIL))
              }}
            >
              <EmailIcon />
              <span>Connect Email</span>
            </div> */}

            <div className="connect-btn phantom" onClick={bindPhantom}>
              <PhantomIcon />
              <p>{accountPhantom ? sortPubKey(accountPhantom.thirdpartyId) : 'Connect Phantom'}</p>
            </div>

            <div className="connect-btn metamask" onClick={bindMetamask}>
              <MetamaskIcon />
              <p>{accountMetamask ? sortPubKey(accountMetamask.thirdpartyId) : 'Connect MetaMask'}</p>
            </div>
          </div>
          <div className="buttons">
            <button
              onClick={() => {
                localStorage.setItem(`has-guide-${account.id}`, 'has-guide')
                navigate('/')
              }}
            >
              Skip
            </button>
            <button
              className="active"
              onClick={() => {
                setSelect('tab2')
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {select === 'tab2' && (
        <div>
          <div className="p-info">
            <div className="avatar" onClick={() => document.getElementById('upload-avatar')?.click()}>
              {(avatarIn && <img src={avatarIn} className="avatar" alt="" />) || (
                <>
                  <AddIcon />
                  <span>Upload Image</span>
                </>
              )}
              <input
                title="upload-avatar"
                id="upload-avatar"
                style={{ display: 'none' }}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0]
                  if (!file) return
                  if (file.size > AVATAR_SIZE_LIMIT) {
                    toast.error('File Too Large, 200k limit')
                    return
                  }
                  setModalOpen(true)
                  try {
                    const { data } = await uploadAvatar(file)
                    setAvatar(data.url)
                    toast.success('upload success')
                  } catch (error) {
                    toast.error('upload fail')
                  } finally {
                    setModalOpen(false)
                  }
                }}
              />
            </div>
            <div className="name">
              <p>Name</p>
              <input
                type="text"
                placeholder="At least 4 characters"
                value={name || account.name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="buttons tab2">
            <button
              className="active"
              onClick={() => {
                localStorage.setItem(`has-finish-${account.id}`, 'has-finish')
                dispatch(
                  userUpdateProfile({
                    avatar: avatar,
                    name: name,
                    pubkey: account.pubkey,
                  }),
                )
                navigate('/')
              }}
            >
              Finish
            </button>
          </div>
        </div>
      )}
      <Modal open={modalOpen}>
        <Box sx={{ ...style }}>
          <CircularProgress size="6rem" color="inherit" />
          <p>Uploading Image</p>
        </Box>
      </Modal>
    </GuideContainer>
  )
}

const GuideContainer = styled.div`
  margin: 20px auto;
  padding-top: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 0px rgb(0 0 0 / 25%);
  box-sizing: border-box;
  border: 4px solid #333333;
  border-radius: 20px;
  background: #f7f9f1;

  & .title {
    text-align: center;
    color: #333333;
    h1 {
      margin: 0;
      margin-top: 20px;
      font-weight: 700;
      font-size: 36px;
      line-height: 40px;
    }
    p {
      font-weight: 400;
      font-size: 20px;
      line-height: 30px;
      margin: 0;
      margin-top: 10px;
    }
  }

  & .tabs {
    margin-top: 20px;
    display: flex;
    border-bottom: 1px solid #d9d9d9;
    justify-content: center;

    > div {
      cursor: pointer;
      text-align: center;
      margin: 0 82px;
      width: 278px;
      position: relative;

      > h3 {
        margin: 0;
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        color: #3dd60699;
      }
      > p {
        margin: 0 0 10px 0;
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        color: #33333399;
      }

      &.active {
        &::after {
          content: '';
          position: absolute;
          border: 2px solid #3dd606;
          width: 100%;
          left: 0;
          bottom: -1px;
        }

        > h3 {
          color: #3dd606;
        }
        > p {
          color: #333333;
        }
      }
    }
  }

  & .connections {
    display: flex;
    flex-direction: column;

    padding-top: 40px;

    & > div {
      margin: 10px auto 10px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      width: 422px;
      height: 48px;
      cursor: pointer;
      border-radius: 10px;

      &.twitter {
        background-color: #4d93f1;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }
      &.discord {
        background: #5368ed;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }
      &.email {
        background: #3dd606;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }

      &.phantom {
        background: #551ff4;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }

      &.metamask {
        background-color: #f6851b;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }

      & svg {
        margin-right: 10px;
      }

      & img {
        width: 30px;
        margin-right: 10px;
      }
    }
  }

  & .p-info {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    > div.avatar {
      width: 160px;
      height: 160px;
      margin-right: 60px;
      cursor: pointer;
      background: #ebeee4;
      border-radius: 10px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      & img.avatar {
        width: 100%;
        height: 100%;
      }

      & img {
        height: 40px;
        width: 40px;
      }

      & span {
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
      }
    }

    > div.name {
      > p {
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        margin-bottom: 10px;
      }
      > input {
        border: none;
        outline: none;
        width: 400px;
        height: 50px;
        padding-left: 18px;
        background: #f8f8f8;
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
        background: #ebeee4;
        border-radius: 10px;
      }
    }
  }

  & .buttons {
    margin: 40px;
    display: flex;
    justify-content: space-between;
    > button {
      cursor: pointer;
      border: none;
      outline: none;
      width: 200px;
      height: 48px;
      background: rgba(51, 51, 51, 0.1);
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      border-radius: 10px;

      &.active {
        background: #3dd606;
        color: #fff;
        box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      }
    }
    &.tab2 {
      justify-content: flex-end;
    }
  }
`
