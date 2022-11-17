/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-17 15:01:26
 * @Description: file description
 */
import * as bs58 from 'bs58';
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
  solana?: any;
} = window;
export type SignMsgResult = {
  signature: string;
  signMsg: string;
  pubkey: string;
};
export async function getSolanaProvider() {
  if (web3Window.solana) {
    await web3Window.solana.connect(); // opens wallet to connect to

    const provider = web3Window.solana;
    if (provider.isPhantom) {
      return provider;
    }
    return null;
  }
  return null;
}
export async function getPhantomAddr() {
  const solanaProvider = await getSolanaProvider();
  if (!solanaProvider) return undefined;
  const pubkey = solanaProvider.publicKey;
  return pubkey.toString();
}
export async function signMsgWithPhantom(): Promise<SignMsgResult | undefined> {
  const solanaProvider = await getSolanaProvider();
  if (!solanaProvider) {
    alert('phantom required');
    return undefined;
  }
  const pubkey = solanaProvider.publicKey;
  const { signature: signatureBuf } = await solanaProvider.signMessage(
    Buffer.from(SIGN_MSG)
  );
  const signature = bs58.encode(signatureBuf as Uint8Array | number[]);
  return { pubkey: pubkey.toString(), signature, signMsg: SIGN_MSG };
}
export enum PhantomErrorName {
  PHANTOM_SIGNATURE_REQUEST_ERROR = 'PHANTOM_SIGNATURE_REQUEST_ERROR',
}
const ErrorName = { ...PhantomErrorName, ...ApiErrorName };
const PhantomErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [ErrorName.PHANTOM_SIGNATURE_REQUEST_ERROR]:
    'phantom signature request error',
  ...ApiErrorMessageMap,
};
export class PhantomError extends Error {
  public constructor(name: keyof typeof ErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || PhantomErrorMessageMap[name];
  }
}
export default (): Authorizer => {
  const authorizer = {
    type: AuthorizerType.PHANTOM_WALLET,
    accountType: AccountType.SOLANA,
    webVersion: AuthorizerWebVersion.web3,
    name: 'Phantom Wallet',
    bgColor: '#551FF4',
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
      onLoginError(new PhantomError(ErrorName.PHANTOM_SIGNATURE_REQUEST_ERROR));
    };
    const apiCatch = (msg: string) => {
      onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onLoginError(new PhantomError(ErrorName.API_REQUEST_LOGIN_ERROR, msg));
    };

    signMsgWithPhantom()
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
      onBindError(new PhantomError(ErrorName.PHANTOM_SIGNATURE_REQUEST_ERROR));
    };
    const apiCatch = (msg: string) => {
      onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onBindError(new PhantomError(ErrorName.API_REQUEST_BIND_ERROR, msg));
    };
    signMsgWithPhantom()
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
