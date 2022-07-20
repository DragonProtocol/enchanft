/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 16:57:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-28 13:19:47
 * @Description: 我的nft列表页
 */
import React, { useEffect, useRef, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import styled from 'styled-components';
import { useSynftContract } from '@ecnft/js-sdk-react';
import NFTList, { NftDataItem } from '../components/NFTList';
import {
  getMyNFTokens,
  clearMyNFT,
  selectMyNFTData,
  selectMyNFTDataStatus,
} from '../features/my/mySlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import SplitTextOpacity, {
  SplitTextOpacityFuns,
} from '../components/common/animate/SplitTextOpacity';
import LoadingIcon from '../components/imgs/Loading.gif';
import { MOBILE_BREAK_POINT } from '../utils/constants';
import RemindConnectWallet from '../components/RemindConnectWallet';

function MyEnchaNFT() {
  const wallet = useWallet();
  const walletRef = useRef('');
  const { connection } = useConnection();
  const { synftContract } = useSynftContract();
  const titleRefMy = useRef<SplitTextOpacityFuns>(null);
  const dispatch = useAppDispatch();

  const myNFTData = useAppSelector(selectMyNFTData);
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus);

  useEffect(() => {
    if (!wallet.publicKey) {
      walletRef.current = '';
      dispatch(clearMyNFT());
      return;
    }
    if (walletRef.current === wallet.publicKey.toString()) return;

    walletRef.current = wallet.publicKey.toString();
    const owner = wallet.publicKey;
    dispatch(getMyNFTokens({ owner, connection, synftContract }));
  }, [wallet, connection, synftContract]);

  const nftList: NftDataItem[] = myNFTData;
  const nftListLoading = myNFTDataStatus === 'loading';

  return (
    <MyEnchaNFTWrapper>
      {wallet.publicKey ? (
        <div className="center">
          <div className="list-title">
            <SplitTextOpacity ref={titleRefMy}>My enchanfted</SplitTextOpacity>
          </div>
          <div className="list">
            <NFTList data={nftList} />
            {nftListLoading && (
              <div className="loading">
                <img src={LoadingIcon} alt="" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="remind-connect-wallet-box">
          <RemindConnectWallet />
        </div>
      )}
    </MyEnchaNFTWrapper>
  );
}

export default MyEnchaNFT;

const MyEnchaNFTWrapper = styled.div`
  height: 100%;
  .loading {
    text-align: center;
    margin-top: 100px;
  }
  .center {
    margin-top: 36px;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      margin-top: 12px;
    }
    .list-title {
      font-size: 24px;
      color: #333333;
      text-align: center;
      margin: 0 auto;
      text-transform: uppercase;
      line-height: 40px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 16px;
      }
    }
    .list {
      margin-top: 24px;
    }
  }
  .remind-connect-wallet-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
