/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 17:51:57
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
import { signMsgWithMartian } from '../utils/web3';
import { SignerType, Signer, SignerProcessStatus } from './index';

export enum MartianEventType {
  MARTIAN_BIND_OAUTH_CALLBACK = 'MARTIAN_BIND_OAUTH_CALLBACK',
}
export type MartianBindCallbackParams = {
  code: string;
};

export enum MartianErrorName {
  MARTIAN_SIGNATURE_REQUEST_ERROR = 'MARTIAN_SIGNATURE_REQUEST_ERROR',
}
type ErrorName = MartianErrorName | ApiErrorName;
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

export class Martian extends Signer {
  readonly signerType = SignerType.MARTIAN;

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
        reject(new MartianError(ErrorName.MARTIAN_SIGNATURE_REQUEST_ERROR));
      };
      const signData = await signMsgWithMartian()
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
                new MartianError(
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
