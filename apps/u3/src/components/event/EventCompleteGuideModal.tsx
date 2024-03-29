/* eslint-disable react/no-unescaped-entities */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 16:48:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 14:25:22
 * @Description: file description
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { ButtonPrimary } from '../common/button/ButtonBase';
import ModalBase, { ModalBaseBody } from '../common/modal/ModalBase';
import Tip1Gif from './gifs/tip_1.gif';
import Tip2Gif from './gifs/tip_2.gif';

export type EventCompleteGuideModalProps = {
  isOpen: boolean;
  onGuideEnd?: () => void;
};

export default function EventCompleteGuideModal({
  isOpen,
  onGuideEnd,
}: EventCompleteGuideModalProps) {
  const [step, setStep] = useState(1);
  return (
    <ModalBase
      backdropFilter={false}
      isOpen={isOpen}
      style={{ overlay: { zIndex: 1000 } }}
    >
      <ModalBody>
        {step === 1 ? (
          <>
            <GuideView src={Tip1Gif} />
            <GuideDesc>
              When the event is complete, you can mark the event as completed.
            </GuideDesc>
            <GuideButton onClick={() => setStep(2)}>
              OK, but how can I find it?
            </GuideButton>
          </>
        ) : (
          <>
            <GuideView src={Tip2Gif} />
            <GuideDesc>
              You can find it in the favorites drawer and see what you've done
              in Web3.
            </GuideDesc>
            <GuideButton onClick={() => onGuideEnd && onGuideEnd()}>
              Got it!
            </GuideButton>
          </>
        )}
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled(ModalBaseBody)`
  margin-top: 50vh;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 380px;
  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
`;
const GuideView = styled.img`
  width: 100%;
  height: 200px;
  background: #14171a;
  border-radius: 10px;
`;
const GuideDesc = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;

  color: #ffffff;
`;
const GuideButton = styled(ButtonPrimary)`
  width: 100%;
`;
