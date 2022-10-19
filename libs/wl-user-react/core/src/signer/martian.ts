/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-18 18:43:51
 * @Description: file description
 */
import {
  ApiErrorMessageMap,
  ApiErrorName,
  bindAccount,
  BindResult,
  LoginResult,
} from '../api';
import { AccountType } from '../types';
import { signMsgWithMartian } from '../utils/web3';
import { SignerType, Signer, SignerProcessStatus } from './types';

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
  readonly accountType = AccountType.APTOS;

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
        reject(new MartianError(ErrorName.MARTIAN_SIGNATURE_REQUEST_ERROR));
      };
      const apiCatch = (msg: string) => {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(new MartianError(ErrorName.API_REQUEST_BIND_ERROR, msg));
      };
      signMsgWithMartian()
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
