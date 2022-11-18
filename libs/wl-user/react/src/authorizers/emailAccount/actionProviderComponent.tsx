import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import validator from 'validator';
import { toast } from 'react-toastify';
import { login, bindAccount, sendEmailAuthRequest } from '../../api';
import {
  AuthorizerActionProviderComponentProps,
  AuthorizerType,
} from '../authorizer';
import { useWlUserReact } from '../../hooks';
import ModalBase, {
  ModalBaseTitle,
} from '../../components/common/modal/ModalBase';
import {
  ButtonInfo,
  ButtonPrimary,
} from '../../components/common/button/ButtonBase';
import InputBase from '../../components/common/input/InputBase';

enum ActionType {
  NONE = 'NONE',
  LOGIN = 'LOGIN',
  BIND = 'BIND',
}
enum EmailActionProcessStatus {
  IDLE = 'IDLE',
  EMAIL_SEND_CODE_START = 'EMAIL_SEND_CODE_START',
  EMAIL_SEND_CODE_PENDING = 'EMAIL_SEND_CODE_PENDING',
  EMAIL_SEND_CODE_FULFILLED = 'EMAIL_SEND_CODE_FULFILLED',
  EMAIL_SEND_CODE_REJECTED = 'EMAIL_SEND_CODE_REJECTED',
  EMAIL_VERIFY_CODE_PENDING = 'EMAIL_VERIFY_CODE_PENDING',
  EMAIL_VERIFY_CODE_FULFILLED = 'EMAIL_VERIFY_CODE_FULFILLED',
  EMAIL_VERIFY_CODE_REJECTED = 'EMAIL_VERIFY_CODE_REJECTED',
}
const authorizerType = AuthorizerType.EMAIL;
const defaultProcessState = {
  actionType: ActionType.NONE,
  status: EmailActionProcessStatus.IDLE,
  email: '',
  code: '',
  errorMsg: '',
};
const ActionProviderComponent: React.FC<AuthorizerActionProviderComponentProps> =
  function ({
    onBindSuccess,
    setLoginAction,
    setBindAction,
  }: AuthorizerActionProviderComponentProps) {
    const { user, getAuthorizer } = useWlUserReact();
    const authorizer = getAuthorizer(authorizerType);
    if (!authorizer) throw Error(`${authorizerType} authorizer not found`);
    const [processState, setProcessState] = useState(defaultProcessState);
    const closeModal = useCallback(
      () => setProcessState(defaultProcessState),
      [setProcessState]
    );
    const loginAction = useCallback(() => {
      setProcessState({
        ...processState,
        actionType: ActionType.LOGIN,
        status: EmailActionProcessStatus.EMAIL_SEND_CODE_START,
      });
    }, [processState]);
    const bindAction = useCallback(() => {
      setProcessState({
        ...processState,
        actionType: ActionType.BIND,
        status: EmailActionProcessStatus.EMAIL_SEND_CODE_START,
      });
    }, [processState]);
    useEffect(() => {
      setLoginAction(loginAction);
      setBindAction(bindAction);
    }, [loginAction, bindAction, setLoginAction, setBindAction]);
    const handleSendEmailCode = useCallback(
      (email: string) => {
        if (validator.isEmail(email)) {
          setProcessState({
            ...processState,
            status: EmailActionProcessStatus.EMAIL_SEND_CODE_PENDING,
            email,
          });
          sendEmailAuthRequest(email, user.token)
            .then(({ data: { code, msg } }) => {
              if (code === 0) {
                setProcessState({
                  ...processState,
                  status: EmailActionProcessStatus.EMAIL_SEND_CODE_FULFILLED,
                  email,
                });
              } else {
                setProcessState({
                  ...processState,
                  status: EmailActionProcessStatus.EMAIL_SEND_CODE_REJECTED,
                  email,
                });
                if (msg) toast.error(msg);
              }
            })
            .catch((error) => {
              toast.error(error.message);
              setProcessState({
                ...processState,
                status: EmailActionProcessStatus.EMAIL_SEND_CODE_REJECTED,
                email,
              });
            });
        } else {
          toast.warn('E-mail format is incorrect');
        }
      },
      [processState, setProcessState, user]
    );
    const handleVerifyEmailCode = useCallback(
      (code: string) => {
        if (!validator.isEmpty(code)) {
          setProcessState({
            ...processState,
            status: EmailActionProcessStatus.EMAIL_VERIFY_CODE_PENDING,
            code,
          });
          if (processState.actionType === ActionType.BIND) {
            bindAccount(user.token, {
              type: authorizer.accountType,
              pubkey: processState.email,
              code,
            })
              .then(({ data }) => {
                onBindSuccess(data);
                closeModal();
              })
              .catch((error) => {
                toast.error(error.message);
                setProcessState({
                  ...processState,
                  status: EmailActionProcessStatus.EMAIL_VERIFY_CODE_REJECTED,
                  code,
                });
              });
          }
          // TODO 登录逻辑需等待后端接口完成
        } else {
          toast.warn('verification code must be filled');
        }
      },
      [
        processState,
        setProcessState,
        user,
        onBindSuccess,
        closeModal,
        authorizer,
      ]
    );

    let isOpen = false;
    let displaySendCodeForm = false;
    let displayVerifyCodeForm = false;
    let displayRetry = false;
    let loading = false;
    let desc = '';
    switch (processState.status) {
      case EmailActionProcessStatus.EMAIL_SEND_CODE_START:
        isOpen = true;
        displaySendCodeForm = true;
        break;
      case EmailActionProcessStatus.EMAIL_SEND_CODE_PENDING:
        isOpen = true;
        displaySendCodeForm = true;
        loading = true;
        break;
      case EmailActionProcessStatus.EMAIL_SEND_CODE_FULFILLED:
        isOpen = true;
        displayVerifyCodeForm = true;
        desc = `We emailed the verification code to ${processState.email}. Please fill in the verification code for verification.`;
        break;
      case EmailActionProcessStatus.EMAIL_SEND_CODE_REJECTED:
        isOpen = true;
        displayRetry = true;
        break;
      case EmailActionProcessStatus.EMAIL_VERIFY_CODE_PENDING:
        isOpen = true;
        displayVerifyCodeForm = true;
        loading = true;
        break;
      case EmailActionProcessStatus.EMAIL_VERIFY_CODE_REJECTED:
        isOpen = true;
        displayRetry = true;
        break;
      // no default
    }
    return (
      <AuthProcessModalWrapper backdropFilter isOpen={isOpen}>
        <AuthProcessModalBody className="wl-user-modal-signature_body">
          <ModalBaseTitle>Email Verify</ModalBaseTitle>
          {desc && <AuthProcessModalDesc>{desc}</AuthProcessModalDesc>}

          {displaySendCodeForm && (
            <EmailCodeForm
              confirmText="Get Started!"
              type="email"
              value={processState.email}
              loading={loading}
              onCancel={closeModal}
              onConfirm={handleSendEmailCode}
            />
          )}
          {displayVerifyCodeForm && (
            <EmailCodeForm
              loading={loading}
              onCancel={closeModal}
              onConfirm={handleVerifyEmailCode}
            />
          )}
          {displayRetry && (
            <AuthProcessModalBtns>
              <CancelBtn onClick={() => closeModal()}>Cancel</CancelBtn>
              <ConfirmBtn
                onClick={() => {
                  if (processState.actionType === ActionType.LOGIN) {
                    authorizer.action.login();
                  } else if (processState.actionType === ActionType.BIND) {
                    authorizer.action.bind(user.token);
                  }
                }}
              >
                Retry
              </ConfirmBtn>
            </AuthProcessModalBtns>
          )}
        </AuthProcessModalBody>
      </AuthProcessModalWrapper>
    );
  };
export default ActionProviderComponent;

type EmailCodeFormProps = {
  value?: string;
  loading?: boolean;
  disabled?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  type?: 'email' | 'code';
};
const EmailCodeForm: React.FC<EmailCodeFormProps> = ({
  value: defalutValue,
  loading = false,
  disabled = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type,
}: EmailCodeFormProps) => {
  const [value, setValue] = useState(defalutValue || '');
  return (
    <EmailCodeFormWrapper>
      <EmailCodeFormInput
        type={type === 'email' ? 'email' : 'text'}
        placeholder={type === 'email' ? 'name@example.com' : 'input'}
        disabled={disabled || loading}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <AuthProcessModalBtns>
        <CancelBtn disabled={disabled || loading} onClick={() => onCancel()}>
          {cancelText}
        </CancelBtn>
        <ConfirmBtn
          disabled={disabled || loading}
          onClick={() => onConfirm(value)}
        >
          {loading ? 'Loading ...' : confirmText}{' '}
        </ConfirmBtn>
      </AuthProcessModalBtns>
    </EmailCodeFormWrapper>
  );
};
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
const CancelBtn = styled(ButtonInfo)`
  min-width: 120px;
  height: 48px;
`;
const ConfirmBtn = styled(ButtonPrimary)`
  min-width: 120px;
  height: 48px;
`;
const EmailCodeFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const EmailCodeFormInput = styled(InputBase)``;
