/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-15 18:08:50
 * @Description: 个人信息
 */
import { useSynftContract } from '@ecnft/js-sdk-react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { clearMyNFT, getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from 'features/user/myEnchanftedSlice'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import useInterval from '../hooks/useInterval'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import styled from 'styled-components'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  IconButton,
  TextField,
  Tabs,
  Tab,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import { selectAccount, userUpdateProfile, setTwitter, setDiscord } from '../features/user/accountSlice'
import MainContentBox from '../components/layout/MainContentBox'
import CommunityList, { CommunityListItemsType } from '../components/business/community/CommunityList'
import {
  FollowedCommunitityForEntity,
  selectAll as selectAllForFollowedCommunity,
  selectuserFollowedCommunitiesState,
} from '../features/user/followedCommunitiesSlice'
import { AsyncRequestStatus } from '../types'
import { uploadAvatar } from '../services/api/login'

const formatStoreDataToComponentDataByFollowedCommunities = (
  communities: FollowedCommunitityForEntity[],
): CommunityListItemsType => {
  return communities.map((community) => {
    return {
      data: { ...community, isFollowed: true },
      viewConfig: {
        displayFollow: true,
      },
    }
  })
}
const Profile: React.FC = () => {
  const wallet = useWallet()
  const walletRef = useRef('')
  const accountWindowRef = useRef<Window | null>(null)
  const { connection } = useConnection()
  const { synftContract } = useSynftContract()
  const dispatch = useAppDispatch()

  const account = useAppSelector(selectAccount)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)

  const [openDialog, setOpenDialog] = useState(false)

  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) {
      walletRef.current = ''
      dispatch(clearMyNFT())
      return
    }
    if (walletRef.current === wallet.publicKey.toString()) return

    walletRef.current = wallet.publicKey.toString()
    const owner = wallet.publicKey
    dispatch(getMyNFTokens({ owner, connection, synftContract }))
  }, [wallet, connection, synftContract])

  const updateProfile = useCallback(() => {
    if (!wallet.publicKey) return
    dispatch(
      userUpdateProfile({
        avatar: avatar,
        name: name,
        pubkey: wallet.publicKey.toString(),
      }),
    )
    setOpenDialog(false)
  }, [wallet, name, avatar])

  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.origin === 'https://launch.enchanft.xyz' && e.data.target === 'third-link') {
        const { twitter, discord } = e.data.data
        dispatch(setTwitter(twitter || ''))
        dispatch(setDiscord(discord || ''))
      }
    })
    return () => {
      window.removeEventListener('message', (e) => {})
    }
  }, [])

  useInterval(
    () => {
      // TODO timeout

      const twitter = localStorage.getItem('twitter')
      const discord = localStorage.getItem('discord')
      const accountWindow = localStorage.getItem('account-window')

      if (twitter || discord || accountWindow) {
        dispatch(setTwitter(twitter || ''))
        dispatch(setDiscord(discord || ''))
        localStorage.removeItem('account-window')
        setIsTracking(false)
      }
      
      // console.log('accountWindowRef.current', accountWindowRef.current?.closed,accountWindowRef.current)
    },
    isTracking ? 3000 : null,
  )

  const handleTrackAccountBind = () => {
    localStorage.removeItem('twitter')
    localStorage.removeItem('discord')
    localStorage.removeItem('account-window')
    setIsTracking(true)
  }
  // profile展示信息切换
  const ProfileTabOptions = [
    {
      label: 'My Communities',
      value: 'myCommunities',
    },
    {
      label: 'My Whitelist',
      value: 'myWhitelist',
    },
    {
      label: 'My Enchanfted',
      value: 'myEnchanfted',
    },
  ]
  const [curProfileTab, setCurProfileTab] = useState(ProfileTabOptions[0].value)
  // 获取我的社区列表
  const followedCommunities = useAppSelector(selectAllForFollowedCommunity)
  const { status: followedCommunitiesStatus } = useAppSelector(selectuserFollowedCommunitiesState)
  const loadingFollowedCommunities = followedCommunitiesStatus === AsyncRequestStatus.PENDING
  const followedCommunityItems = formatStoreDataToComponentDataByFollowedCommunities(followedCommunities)

  return (
    <>
      <MainContentBox>
        <ProfileWrapper>
          <div className="profile">
            <img src={account.avatar} alt="" />
            <div>
              <div className="name">
                <h3>{account.name}</h3>{' '}
                <IconButton onClick={() => setOpenDialog(true)}>
                  <EditIcon />
                </IconButton>
              </div>
              <div className="description">
                <span>{wallet.publicKey?.toString()}</span>
                <div className="thirdparty-box">
                  <div className="thirdparty-btn">
                    <div
                      className="thirdparty-inner"
                      onClick={() => {
                        // TODO 跳转回原页面
                        window.open(
                          // 'http://localhost:3000/#/callback',
                          'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=bzBLMWs0NnBHejQ4a3dXYkROTHk6MTpjaQ&redirect_uri=https://launch.enchanft.xyz/callback&scope=tweet.read+users.read+offline.access&state=3063390848298.8647&code_challenge=challenge&code_challenge_method=plain',
                          '__blank',
                          'width=640,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no',
                        )
                        handleTrackAccountBind()
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="20"
                        height="20"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
                        ></path>
                      </svg>
                      {account?.twitter || 'Connect Twitter'}
                    </div>
                    {account?.twitter && (
                      <div className="thirdparty-disconnect">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="18"
                          height="18"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 1024 1024"
                        >
                          <path
                            fill="currentColor"
                            d="M832.6 191.4c-84.6-84.6-221.5-84.6-306 0l-96.9 96.9l51 51l96.9-96.9c53.8-53.8 144.6-59.5 204 0c59.5 59.5 53.8 150.2 0 204l-96.9 96.9l51.1 51.1l96.9-96.9c84.4-84.6 84.4-221.5-.1-306.1zM446.5 781.6c-53.8 53.8-144.6 59.5-204 0c-59.5-59.5-53.8-150.2 0-204l96.9-96.9l-51.1-51.1l-96.9 96.9c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l96.9-96.9l-51-51l-96.8 97zM260.3 209.4a8.03 8.03 0 0 0-11.3 0L209.4 249a8.03 8.03 0 0 0 0 11.3l554.4 554.4c3.1 3.1 8.2 3.1 11.3 0l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3L260.3 209.4z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="thirdparty-btn thirdparty-discord">
                    <div
                      className="thirdparty-inner"
                      onClick={() => {
                        // TODO 跳转回原页面
                        window.open(
                          'https://discord.com/oauth2/authorize?response_type=code&client_id=991279625395241014&scope=identify%20guilds.join&state=15773059ghq9183habn&redirect_uri=https://launch.enchanft.xyz/callback?type=DISCORD&prompt=consent',
                          '__blank',
                          'width=640,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no',
                        )
                        handleTrackAccountBind()

                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="20"
                        height="20"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                        ></path>
                      </svg>
                      {account?.discord || 'Connect Discord'}
                    </div>
                    {/* <div className="thirdparty-disconnect">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="18"
                        height="18"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 1024 1024"
                      >
                        <path
                          fill="currentColor"
                          d="M832.6 191.4c-84.6-84.6-221.5-84.6-306 0l-96.9 96.9l51 51l96.9-96.9c53.8-53.8 144.6-59.5 204 0c59.5 59.5 53.8 150.2 0 204l-96.9 96.9l51.1 51.1l96.9-96.9c84.4-84.6 84.4-221.5-.1-306.1zM446.5 781.6c-53.8 53.8-144.6 59.5-204 0c-59.5-59.5-53.8-150.2 0-204l96.9-96.9l-51.1-51.1l-96.9 96.9c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l96.9-96.9l-51-51l-96.8 97zM260.3 209.4a8.03 8.03 0 0 0-11.3 0L209.4 249a8.03 8.03 0 0 0 0 11.3l554.4 554.4c3.1 3.1 8.2 3.1 11.3 0l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3L260.3 209.4z"
                        ></path>
                      </svg>
                    </div> */}
                  </div>
                  {/* <Button>Discord</Button> */}
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <ProfileTabsBox>
            <ProfileTabs>
              {ProfileTabOptions.map((item) => (
                <ProfileTab
                  key={item.value}
                  onClick={() => setCurProfileTab(item.value)}
                  isActive={item.value === curProfileTab}
                >
                  {item.label}
                </ProfileTab>
              ))}
            </ProfileTabs>
            <ProfileTabContentBox>
              {curProfileTab === 'myCommunities' && (
                <CommunityList items={followedCommunityItems} loading={loadingFollowedCommunities} />
              )}
            </ProfileTabContentBox>
          </ProfileTabsBox>
        </ProfileWrapper>
        <Dialog open={openDialog} fullWidth={true} maxWidth={'lg'}>
          <DialogContent>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
              }}
            >
              <h4>Profile picture</h4>
              <img
                src={avatar}
                alt=""
                style={{
                  width: '100px',
                  height: '100px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  document.getElementById('uploadinput')?.click()
                }}
              />
              <input id='uploadinput' style={{display: 'none'}} type="file" onChange={async (e) => {
                const file = e.target.files && e.target.files[0]
                console.log(file)
                if (!file) return
                const {data} = await uploadAvatar(file)
                console.log('uploadinput', data)
                setAvatar(data.url)
              }}/>

              <FormControl variant="standard">
                <h4>name</h4>
                <TextField id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => updateProfile()}>save</Button>
            <Button onClick={() => setOpenDialog(false)}>cancel</Button>
          </DialogActions>
        </Dialog>
      </MainContentBox>
    </>
  )
}
export default Profile
const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;

  .profile {
    display: flex;
    flex-direction: row;
    img {
      width: 100px;
      height: 100px;
    }
    > div {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 30px;
      > div {
        display: flex;
        &.name {
          h3 {
            font-size: 32px;
            margin: 0;
          }
        }
        &.description {
          align-items: center;
          justify-content: space-between;
          font-size: 20px;
        }
      }
    }
  }
  .thirdparty-box {
    display: flex;
    & > div {
      margin-left: 10px;
    }
    .thirdparty-btn {
      border-radius: 4px;
      display: flex;
      align-items: center;
      overflow: hidden;
      .thirdparty-inner {
        background: #489be9;
        padding: 5px;
        color: white;
        display: flex;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
        svg {
          margin-right: 5px;
        }
      }
    }
    .thirdparty-discord {
      .thirdparty-inner {
        background: #5368ed;
      }
      .thirdparty-disconnect {
        border: 1px solid #5368ed;
        svg {
          color: #5368ed;
        }
      }
    }

    .thirdparty-disconnect {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100% - 2px);
      border: 1px solid #489be9;
      padding: 0 5px;
      cursor: pointer;
      svg {
        color: #489be9;
      }
    }
  }

  hr {
    margin: 10px 0;
  }
`
const ProfileTabsBox = styled.div``
const ProfileTabs = styled.div`
  display: flex;
  margin-top: 40px;
  gap: 60px;
`
const ProfileTab = styled.div<{ isActive?: boolean }>`
  cursor: pointer;
  border-bottom: ${(props) => (props.isActive ? '3px solid rgba(21, 21, 21, 100);' : 'none')};
  color: ${(props) => (props.isActive ? '#000' : '#999')};
  padding-bottom: 10px;
  text-align: center;
  font-weight: bold;
`
const ProfileTabContentBox = styled.div`
  margin-top: 40px;
`
const ProfileProjectTabsBox = styled.div`
  margin-bottom: 40px;
`
