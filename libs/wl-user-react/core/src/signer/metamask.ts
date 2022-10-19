/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-18 18:42:17
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
import { signMsgWithMetaMask } from '../utils/web3';
import { SignerType, Signer, SignerProcessStatus } from './types';

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
  readonly accountType = AccountType.EVM;
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
        reject(new MetamaskError(ErrorName.METAMASK_SIGNATURE_REQUEST_ERROR));
      };
      const apiCatch = (msg: string) => {
        this.signerProcessStatusChange(SignerProcessStatus.BIND_REJECTED);
        reject(new MetamaskError(ErrorName.API_REQUEST_BIND_ERROR, msg));
      };

      signMsgWithMetaMask()
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
    });
  }
}
