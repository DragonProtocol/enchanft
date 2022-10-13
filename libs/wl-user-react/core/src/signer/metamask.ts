/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 11:40:19
 * @Description: file description
 */
import {
  bindAccount,
  BindResult,
  LoginResult,
  unbindAccount,
  UnBindResult,
} from '../api';
import { signMsgWithMetaMask } from '../utils/web3';
import { SignerType, Signer, SignerAccountTypeMap } from './index';

export enum MetamaskEventType {
  METAMASK_BIND_OAUTH_CALLBACK = 'METAMASK_BIND_OAUTH_CALLBACK',
}
export type MetamaskBindCallbackParams = {
  code: string;
};

export enum MetamaskErrorName {
  FETCH_METAMASK_BIND_ERROR = 'FETCH_METAMASK_BIND_ERROR',
  FETCH_METAMASK_UNBIND_ERROR = 'FETCH_METAMASK_UNBIND_ERROR',
}
const MetamaskErrorMessageMap: { [name in MetamaskErrorName]: string } = {
  [MetamaskErrorName.FETCH_METAMASK_BIND_ERROR]: 'FETCH_METAMASK_BIND_ERROR',
  [MetamaskErrorName.FETCH_METAMASK_UNBIND_ERROR]:
    'FETCH_METAMASK_UNBIND_ERROR',
};
export class MetamaskError extends Error {
  public constructor(name: MetamaskErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || MetamaskErrorMessageMap[name];
  }
}

export class Metamask extends Signer {
  public get signerType() {
    return SignerType.METAMASK;
  }
  constructor() {
    super();
  }

  public login(): Promise<LoginResult> {
    return new Promise(async (resolve, reject) => {
      reject('Currently not supported');
    });
  }
  public bind(token: string): Promise<BindResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const signData = await signMsgWithMetaMask();
        if (signData) {
          const result = await bindAccount(token, {
            type: SignerAccountTypeMap[this.signerType],
            signature: signData.signature,
            payload: signData.signMsg,
            pubkey: signData.pubkey,
          });
          if (result.data.code === 0) {
            resolve(result.data.data);
          } else {
            reject(
              new MetamaskError(
                MetamaskErrorName.FETCH_METAMASK_BIND_ERROR,
                result.data.msg
              )
            );
          }
        }
      } catch (error) {
        throw error;
      }
    });
  }
  public unbind(token: string): Promise<UnBindResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await unbindAccount(
          token,
          SignerAccountTypeMap[this.signerType]
        );
        if (result.data.code === 0) {
          resolve(result.data.data);
        } else {
          reject(
            new MetamaskError(
              MetamaskErrorName.FETCH_METAMASK_UNBIND_ERROR,
              result.data.msg
            )
          );
        }
      } catch (error) {
        throw error;
      }
    });
  }
}
