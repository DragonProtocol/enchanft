/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:20:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 15:06:00
 * @Description: 个人信息
 */
import { useSynftContract } from '@ecnft/js-sdk-react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { clearMyNFT, getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from 'features/user/myEnchanftedSlice'
import React, { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
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

import { selectAccount, userUpdateProfile } from '../features/user/accountSlice'

const Profile: React.FC = () => {
  const wallet = useWallet()
  const walletRef = useRef('')
  const { connection } = useConnection()
  const { synftContract } = useSynftContract()
  const dispatch = useAppDispatch()

  const account = useAppSelector(selectAccount)
  const [name, setName] = useState('')
  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)

  const [openDialog, setOpenDialog] = useState(false)

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
        avatar: 'avatar-test',
        name: name,
        pubkey: wallet.publicKey.toString(),
      }),
    )
  }, [wallet, name])

  return (
    <>
      <ProfileWrapper>
        <div className="profile">
          <img src={'https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk?ext=jpeg'} alt="" />
          <div>
            <div className="name">
              <h3>{account.name}</h3>{' '}
              <IconButton onClick={() => setOpenDialog(true)}>
                <EditIcon />
              </IconButton>
            </div>
            <div className="description">
              <span>{wallet.publicKey?.toString()}</span>
              <div>
                <Button>Twitter</Button>
                <Button>Discord</Button>
              </div>
            </div>
          </div>
        </div>
        <Divider />
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
              src={'https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk?ext=jpeg'}
              alt=""
              style={{
                width: '100px',
                height: '100px',
              }}
            />

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

  hr {
    margin: 10px 0;
  }
`
