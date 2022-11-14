import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalBase, { ModalBaseTitle } from '../common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import { ButtonPrimary, ButtonInfo } from '../common/button/ButtonBase';
import {
  AuthorizerActionProcessStatus,
  Authorizer,
  AuthorizerWebVersion,
} from '../../authorizers';
import { useWlUserReact } from '../../provider';
export type AuthProcessModalProps = {
  authorizer: Authorizer;
};
enum ActionType {
  none = 'none',
  login = 'login',
  bind = 'bind',
}
const actionTypeMap = {
  [ActionType.login]: {
    pendingName: 'Logging',
    rejectName: 'Login',
  },
  [ActionType.bind]: {
    pendingName: 'binding',
    rejectName: 'Bind',
  },
};
const AuthProcessModal: React.FC<AuthProcessModalProps> = ({
  authorizer,
}: AuthProcessModalProps) => {
  const { user } = useWlUserReact();
  const [processState, setProcessState] = useState({
    actionType: ActionType.none,
    status: AuthorizerActionProcessStatus.IDLE,
    errorMsg: '',
  });
  const closeModal = () =>
    setProcessState({
      actionType: ActionType.none,
      status: AuthorizerActionProcessStatus.IDLE,
      errorMsg: '',
    });
  authorizer.action.loginListener({
    process: (status) =>
      setProcessState({
        ...processState,
        actionType: ActionType.login,
        status: status,
      }),
    success: (result) => closeModal(),
  });

  authorizer.action.bindListener({
    process: (status) =>
      setProcessState({
        ...processState,
        actionType: ActionType.bind,
        status: status,
      }),
    success: (result) => closeModal(),
  });
  let isOpen = false;
  let title = '';
  let desc = '';
  let closeBtnDisplay = false;
  let retryBtnDisplay = false;
  switch (processState.status) {
    case AuthorizerActionProcessStatus.SIGNATURE_PENDING:
      isOpen = true;
      if (authorizer.webVersion === AuthorizerWebVersion.web3) {
        title = '🕹 Signature Request';
        desc = `Please sign the message in your wallet to ${processState.actionType} WL, we use this signature to verify that you‘re theowner.`;
      } else if (authorizer.webVersion === AuthorizerWebVersion.web2) {
        title = '🕹 Authorize Request';
        desc = ` Please authorize your ${authorizer.name} account.`;
      }
      break;
    case AuthorizerActionProcessStatus.SIGNATURE_REJECTED:
      isOpen = true;
      if (authorizer.webVersion === AuthorizerWebVersion.web3) {
        title = '❌ Signature Rejected';
        desc = `Please sign the message in your wallet to ${processState.actionType}.`;
      } else if (authorizer.webVersion === AuthorizerWebVersion.web2) {
        title = '❌ Authorize Rejected';
        desc = ` Please authorize your ${authorizer.name} account.`;
      }
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
    case AuthorizerActionProcessStatus.API_PENDING:
      isOpen = true;
      title = `⏳ ${actionTypeMap[processState.actionType].pendingName}`;
      desc = `${
        actionTypeMap[processState.actionType].pendingName
      } in now, Please wait...`;
      break;
    case AuthorizerActionProcessStatus.API_REJECTED:
      isOpen = true;
      title = `❌ ${actionTypeMap[processState.actionType].rejectName} Fail`;
      desc = processState.errorMsg;
      closeBtnDisplay = true;
      retryBtnDisplay = true;
      break;
  }
  return (
    <AuthProcessModalWrapper
      zIndex={10000}
      backdropFilter={true}
      isOpen={isOpen}
    >
      <AuthProcessModalBody className="wl-user-modal-signature_body">
        <ModalBaseTitle>{title}</ModalBaseTitle>
        <AuthProcessModalDesc className="wl-user-modal-signature_title">
          {desc}
        </AuthProcessModalDesc>
        <AuthProcessModalBtns className="wl-user-modal-signature_btns">
          {closeBtnDisplay && (
            <CloseBtn onClick={() => closeModal()}>Cancel</CloseBtn>
          )}
          {retryBtnDisplay && (
            <RetryBtn
              onClick={() => {
                if (processState.actionType === ActionType.login) {
                  authorizer.action.login();
                } else if (processState.actionType === ActionType.bind) {
                  authorizer.action.bind(user.token);
                }
              }}
            >
              Retry
            </RetryBtn>
          )}
        </AuthProcessModalBtns>
      </AuthProcessModalBody>
    </AuthProcessModalWrapper>
  );
};
export default AuthProcessModal;

const AuthProcessModalWrapper = styled(ModalBase)``;
const AuthProcessModalBody = styled.div`
  width: 540px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f7f9f1;
  border-radius: 20px;
`;
const AuthProcessModalDesc = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
const AuthProcessModalBtns = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 24px;
`;
const CloseBtn = styled(ButtonInfo)`
  width: 120px;
  height: 48px;
`;
const RetryBtn = styled(ButtonPrimary)`
  width: 120px;
  height: 48px;
`;
