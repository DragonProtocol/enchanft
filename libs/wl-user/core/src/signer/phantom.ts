/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-21 17:03:05
 * @Description: file description
 */
import {
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  BindResult,
  LoginResult,
  AccountType,
} from '../api';
import { signMsgWithPhantom } from '../utils/web3';
import { SignerType, Signer, SignerProcessStatus } from './types';

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
  readonly accountType = AccountType.SOLANA;
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
      this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_PENDING);
      const signMsgCatch = () => {
        this.signerProcessStatusChange(SignerProcessStatus.SIGNATURE_REJECTED);
        reject(new PhantomError(ErrorName.PHANTOM_SIGNATURE_REQUEST_ERROR));
      };
      const apiCatch = (msg: string) => {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(new PhantomError(ErrorName.API_REQUEST_BIND_ERROR, msg));
      };
      signMsgWithPhantom()
        .then(async (signData) => {
          if (signData) {
            this.signerProcessStatusChange(SignerProcessStatus.BIND_PENDING);
            bindAccount(token, {
              type: this.accountType,
              signature: signData.signature,
              payload: signData.signMsg,
              pubkey: signData.pubkey,
            })
              .then((result) => {
                if (result.data) {
                  this.signerProcessStatusChange(
                    SignerProcessStatus.BIND_FULFILLED
                  );
                  resolve(result.data);
                } else {
                  apiCatch('result data is null');
                }
              })
              .catch((error) => apiCatch(error.message));
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
