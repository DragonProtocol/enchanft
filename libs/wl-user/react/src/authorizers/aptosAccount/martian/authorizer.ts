/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 14:28:20
 * @Description: file description
 */
import {
  AccountType,
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  login,
} from '../../../api';
import AuthProcessModal from '../../../components/AuthProcessModal/AuthProcessModal';
import { SIGN_MSG } from '../../../constants';
import {
  LoginActionStaticFunction,
  BindActionStaticFunction,
  createActionConfigByStaticFunction,
} from '../../actionConfig';
import {
  AuthorizerActionProcessStatus,
  Authorizer,
  AuthorizerType,
  AuthorizerWebVersion,
} from '../../authorizer';
import iconUrl from './icon.svg';

export const web3Window: typeof window & {
  martian?: any;
} = window;
export type SignMsgResult = {
  signature: string;
  signMsg: string;
  pubkey: string;
};
export async function getAptosProvider() {
  if (web3Window.martian) {
    await web3Window.martian.connect();
    const provider = web3Window.martian;
    return provider;
  }
  return null;
}
export async function getMartianAddr() {
  const provider = await getAptosProvider();
  if (!provider) return undefined;
  const { publicKey } = await provider.account();
  return publicKey.slice(2);
}
export async function signMsgWithMartian(): Promise<SignMsgResult | undefined> {
  const provider = await getAptosProvider();
  if (!provider) {
    alert('martian required');
    return undefined;
  }
  const walletAddr = await getMartianAddr();
  const resp = await provider.signMessage({
    message: SIGN_MSG,
  });
  const { signature } = resp;
  return {
    pubkey: walletAddr,
    signature: signature.slice(2),
    signMsg: resp.fullMessage,
  };
}
export enum MartianErrorName {
  MARTIAN_SIGNATURE_REQUEST_ERROR = 'MARTIAN_SIGNATURE_REQUEST_ERROR',
}
const ErrorName = { ...MartianErrorName, ...ApiErrorName };
const MartianErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [ErrorName.MARTIAN_SIGNATURE_REQUEST_ERROR]:
    'martian signature request error',
  ...ApiErrorMessageMap,
};
export class MartianError extends Error {
  public constructor(name: keyof typeof ErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || MartianErrorMessageMap[name];
  }
}
export default (): Authorizer => {
  const authorizer = {
    type: AuthorizerType.MARTIAN_WALLET,
    accountType: AccountType.APTOS,
    webVersion: AuthorizerWebVersion.web3,
    name: 'Martian Wallet',
    bgColor: '#333333',
    nameColor: '#FFFFFF',
    iconUrl,
    actionProcessComponent: AuthProcessModal,
  };
  // login action
  const loginAction: LoginActionStaticFunction = (
    onLoginProcess,
    onLoginSuccess,
    onLoginError
  ) => {
    onLoginProcess(AuthorizerActionProcessStatus.SIGNATURE_PENDING);
    const signMsgCatch = () => {
      onLoginProcess(AuthorizerActionProcessStatus.SIGNATURE_REJECTED);
      onLoginError(new MartianError(ErrorName.MARTIAN_SIGNATURE_REQUEST_ERROR));
    };
    const apiCatch = (msg: string) => {
      onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onLoginError(new MartianError(ErrorName.API_REQUEST_LOGIN_ERROR, msg));
    };

    signMsgWithMartian()
      .then((signData) => {
        if (signData) {
          onLoginProcess(AuthorizerActionProcessStatus.API_PENDING);
          login({
            type: authorizer.accountType,
            signature: signData.signature,
            payload: signData.signMsg,
            pubkey: signData.pubkey,
          })
            .then((result) => {
              onLoginProcess(AuthorizerActionProcessStatus.API_FULFILLED);
              onLoginSuccess(result.data);
            })
            .catch((error: Error) => {
              apiCatch(error.message);
            });
        } else {
          signMsgCatch();
        }
      })
      .catch(() => {
        signMsgCatch();
      });
  };
  // bind action
  const bindAction: BindActionStaticFunction = (
    token,
    onBindProcess,
    onBindSuccess,
    onBindError
  ) => {
    onBindProcess(AuthorizerActionProcessStatus.SIGNATURE_PENDING);
    const signMsgCatch = () => {
      onBindProcess(AuthorizerActionProcessStatus.SIGNATURE_REJECTED);
      onBindError(new MartianError(ErrorName.MARTIAN_SIGNATURE_REQUEST_ERROR));
    };
    const apiCatch = (msg: string) => {
      onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onBindError(new MartianError(ErrorName.API_REQUEST_BIND_ERROR, msg));
    };
    signMsgWithMartian()
      .then((signData) => {
        if (signData) {
          onBindProcess(AuthorizerActionProcessStatus.API_PENDING);
          bindAccount(token, {
            type: authorizer.accountType,
            signature: signData.signature,
            payload: signData.signMsg,
            pubkey: signData.pubkey,
          })
            .then((result) => {
              if (result.data) {
                onBindProcess(AuthorizerActionProcessStatus.API_FULFILLED);
                onBindSuccess(result.data);
              } else {
                apiCatch('result data is null');
              }
            })
            .catch((error: Error) => apiCatch(error.message));
        } else {
          signMsgCatch();
        }
      })
      .catch(() => {
        signMsgCatch();
      });
  };
  return {
    ...authorizer,
    action: createActionConfigByStaticFunction(loginAction, bindAction),
  };
};
