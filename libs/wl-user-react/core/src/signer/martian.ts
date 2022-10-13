/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 11:40:02
 * @Description: file description
 */
import {
  bindAccount,
  BindResult,
  LoginResult,
  unbindAccount,
  UnBindResult,
} from '../api';
import { signMsgWithMartian } from '../utils/web3';
import { SignerType, Signer, SignerAccountTypeMap } from './index';

export enum MartianEventType {
  MARTIAN_BIND_OAUTH_CALLBACK = 'MARTIAN_BIND_OAUTH_CALLBACK',
}
export type MartianBindCallbackParams = {
  code: string;
};

export enum MartianErrorName {
  FETCH_MARTIAN_BIND_ERROR = 'FETCH_MARTIAN_BIND_ERROR',
  FETCH_MARTIAN_UNBIND_ERROR = 'FETCH_MARTIAN_UNBIND_ERROR',
}
const MartianErrorMessageMap: { [name in MartianErrorName]: string } = {
  [MartianErrorName.FETCH_MARTIAN_BIND_ERROR]: 'FETCH_MARTIAN_BIND_ERROR',
  [MartianErrorName.FETCH_MARTIAN_UNBIND_ERROR]: 'FETCH_MARTIAN_UNBIND_ERROR',
};
export class MartianError extends Error {
  public constructor(name: MartianErrorName, message?: string) {
    super();
    this.name = name;
    this.message = message || MartianErrorMessageMap[name];
  }
}

export class Martian extends Signer {
  public get signerType() {
    return SignerType.MARTIAN;
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
        const signData = await signMsgWithMartian();
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
              new MartianError(
                MartianErrorName.FETCH_MARTIAN_BIND_ERROR,
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
            new MartianError(
              MartianErrorName.FETCH_MARTIAN_UNBIND_ERROR,
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
