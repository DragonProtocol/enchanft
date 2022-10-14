/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 17:52:09
 * @Description: file description
 */
import {
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  BindResult,
  LoginResult,
} from '../api';
import { SignerAccountTypeMap } from '../utils';
import { signMsgWithMetaMask } from '../utils/web3';
import { SignerType, Signer, SignerProcessStatus } from './index';

export enum MetamaskEventType {
  METAMASK_BIND_OAUTH_CALLBACK = 'METAMASK_BIND_OAUTH_CALLBACK',
}
export type MetamaskBindCallbackParams = {
  code: string;
};

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

export class Metamask extends Signer {
  readonly signerType = SignerType.METAMASK;
  constructor() {
    super();
  }

  public login(): Promise<LoginResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.LOGIN_REJECTED);
      reject('Currently not supported');
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
      const signMsgCatch = () => {
        this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_REJECTED);
        reject(new MetamaskError(ErrorName.METAMASK_SIGNATURE_REQUEST_ERROR));
      };

      signMsgWithMetaMask()
        .then(async (signData) => {
          if (signData) {
            const result = await bindAccount(token, {
              type: SignerAccountTypeMap[this.signerType],
              signature: signData.signature,
              payload: signData.signMsg,
              pubkey: signData.pubkey,
            });
            if (result.data.code === 0) {
              this.signerProcessStatusChange(
                SignerProcessStatus.BIND_FULFILLED
              );
              resolve(result.data.data);
            } else {
              this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
              reject(
                new MetamaskError(
                  ErrorName.API_REQUEST_BIND_ERROR,
                  result.data.msg
                )
              );
            }
          } else {
            signMsgCatch();
          }
        })
        .catch(() => {
          signMsgCatch();
        });
    });
  }
}
