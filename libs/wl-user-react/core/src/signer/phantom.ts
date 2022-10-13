/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 11:40:35
 * @Description: file description
 */
import {
  bindAccount,
  BindResult,
  LoginResult,
  unbindAccount,
  UnBindResult,
} from '../api';
import { signMsgWithPhantom } from '../utils/web3';
import { SignerType, Signer, SignerAccountTypeMap } from './index';

export enum PhantomEventType {
  PHANTOM_BIND_OAUTH_CALLBACK = 'PHANTOM_BIND_OAUTH_CALLBACK',
}
export type PhantomBindCallbackParams = {
  code: string;
};

export enum PhantomErrorName {
  FETCH_PHANTOM_BIND_ERROR = 'FETCH_PHANTOM_BIND_ERROR',
  FETCH_PHANTOM_UNBIND_ERROR = 'FETCH_PHANTOM_UNBIND_ERROR',
}
const PhantomErrorMessageMap: { [name in PhantomErrorName]: string } = {
  [PhantomErrorName.FETCH_PHANTOM_BIND_ERROR]: 'FETCH_PHANTOM_BIND_ERROR',
  [PhantomErrorName.FETCH_PHANTOM_UNBIND_ERROR]: 'FETCH_PHANTOM_UNBIND_ERROR',
};
export class PhantomError extends Error {
  public constructor(name: PhantomErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || PhantomErrorMessageMap[name];
  }
}

export class Phantom extends Signer {
  public get signerType() {
    return SignerType.PHANTOM;
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
        const signData = await signMsgWithPhantom();
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
              new PhantomError(
                PhantomErrorName.FETCH_PHANTOM_BIND_ERROR,
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
            new PhantomError(
              PhantomErrorName.FETCH_PHANTOM_UNBIND_ERROR,
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
