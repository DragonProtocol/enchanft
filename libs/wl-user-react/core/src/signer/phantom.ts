/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 17:52:15
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
import { signMsgWithPhantom } from '../utils/web3';
import { SignerType, Signer, SignerProcessStatus } from './index';

export enum PhantomEventType {
  PHANTOM_BIND_OAUTH_CALLBACK = 'PHANTOM_BIND_OAUTH_CALLBACK',
}
export type PhantomBindCallbackParams = {
  code: string;
};

export enum PhantomErrorName {
  PHANTOM_SIGNATURE_REQUEST_ERROR = 'PHANTOM_SIGNATURE_REQUEST_ERROR',
}
type ErrorName = PhantomErrorName | ApiErrorName;
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

export class Phantom extends Signer {
  readonly signerType = SignerType.PHANTOM;
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
        reject(new PhantomError(ErrorName.PHANTOM_SIGNATURE_REQUEST_ERROR));
      };
      signMsgWithPhantom()
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
                new PhantomError(
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
