/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-31 17:06:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:25:25
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import { getClaimAnimationData } from '../../../utils/lottie';
import claim_bg_img from './imgs/claim_bg.png';

export type CommunityCheckedinClaimModalDataType = {
  seqDays: number;
  contribution: number;
};
export type CommunityCheckedinClaimModalProps = {
  data: CommunityCheckedinClaimModalDataType;
  open: boolean;
};
const CommunityCheckedinClaimModal: React.FC<
  CommunityCheckedinClaimModalProps
> = ({ data, open }: CommunityCheckedinClaimModalProps) => {
  const { seqDays, contribution } = data;
  const animationData = getClaimAnimationData();
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <CommunityCheckedinClaimModalWrapper
      style={{ display: open ? 'block' : 'none' }}
    >
      <ClaimTextBox>
        <ClaimTextPlusNum>+ {contribution}</ClaimTextPlusNum>
        <ClaimTextDesc>Got {contribution} contribution scores!</ClaimTextDesc>
      </ClaimTextBox>
      <LottieBox>
        <Lottie options={defaultOptions} />
      </LottieBox>
    </CommunityCheckedinClaimModalWrapper>
  );
};
export default CommunityCheckedinClaimModal;
const CommunityCheckedinClaimModalWrapper = styled.div`
  position: fixed;
  width: 860px;
  height: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-out;
`;
const ClaimTextBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background-image: url(${claim_bg_img});
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
`;
const ClaimTextPlusNum = styled.span`
  font-weight: 700;
  font-size: 40px;
  line-height: 60px;
  color: #3dd707;
`;
const ClaimTextDesc = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  color: #333333;
`;
const LottieBox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 860px;
  height: 360px;
`;
