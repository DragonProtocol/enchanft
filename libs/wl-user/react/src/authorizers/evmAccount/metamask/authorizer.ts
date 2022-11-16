/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-07 19:28:17
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-13 12:40:07
 * @Description: file description
 */
import { ethers } from 'ethers';
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
  ethereum?: any;
} = window;
export type SignMsgResult = {
  signature: string;
  signMsg: string;
  pubkey: string;
};
export async function getEthProvider() {
  if (web3Window.ethereum) {
    const provider = new ethers.providers.Web3Provider(web3Window.ethereum);
    await provider.send('eth_requestAccounts', []);
    return provider;
  } else {
    return null;
  }
}
export async function getMetaMaskAddr() {
  const ethProvider = await getEthProvider();
  if (!ethProvider) return undefined;
  const signer = ethProvider.getSigner();
  const walletAddr = await signer.getAddress();
  return walletAddr;
}

export async function signMsgWithMetaMask(): Promise<
  SignMsgResult | undefined
> {
  const ethProvider = await getEthProvider();
  if (!ethProvider) {
    alert('metamask required');
    return undefined;
  }
  const signer = ethProvider.getSigner();
  const walletAddr = await signer.getAddress();
  const signature = await signer.signMessage(SIGN_MSG);
  return { pubkey: walletAddr, signature, signMsg: SIGN_MSG };
}
export enum MetamaskErrorName {
  METAMASK_SIGNATURE_REQUEST_ERROR = 'METAMASK_SIGNATURE_REQUEST_ERROR',
}
type ErrorName = MetamaskErrorName | ApiErrorName;
const ErrorName = { ...MetamaskErrorName, ...ApiErrorName };
const MetamaskErrorMessageMap: {
  [name in keyof typeof ErrorName]: string;
} = {
  [MetamaskErrorName.METAMASK_SIGNATURE_REQUEST_ERROR]:
    'metamask signature request error',
  ...ApiErrorMessageMap,
};
export class MetamaskError extends Error {
  public constructor(name: keyof typeof ErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || MetamaskErrorMessageMap[name];
  }
}
export default (): Authorizer => {
  const authorizer = {
    type: AuthorizerType.METAMASK_WALLET,
    accountType: AccountType.EVM,
    webVersion: AuthorizerWebVersion.web3,
    name: 'MetaMask Wallet',
    bgColor: '#F6851B',
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
      onLoginError(
        new MetamaskError(ErrorName.METAMASK_SIGNATURE_REQUEST_ERROR)
      );
    };
    const apiCatch = (msg: string) => {
      onLoginProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onLoginError(new MetamaskError(ErrorName.API_REQUEST_LOGIN_ERROR, msg));
    };

    signMsgWithMetaMask()
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
            .catch((error) => {
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
      onBindError(
        new MetamaskError(ErrorName.METAMASK_SIGNATURE_REQUEST_ERROR)
      );
    };
    const apiCatch = (msg: string) => {
      onBindProcess(AuthorizerActionProcessStatus.API_REJECTED);
      onBindError(new MetamaskError(ErrorName.API_REQUEST_BIND_ERROR, msg));
    };

    signMsgWithMetaMask()
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
            .catch((error) => {
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
  return {
    ...authorizer,
    action: createActionConfigByStaticFunction(loginAction, bindAction),
  };
};
