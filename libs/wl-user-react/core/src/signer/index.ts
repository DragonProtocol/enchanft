/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-11 10:33:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-14 17:28:27
 * @Description: file description
 */
export { Twitter, TwitterError, TwitterErrorName } from './twitter';
export { Discord, DiscordError, DiscordErrorName } from './discord';
export { Metamask, MetamaskError, MetamaskErrorName } from './metamask';
export { Phantom, PhantomError, PhantomErrorName } from './phantom';
export { Martian, MartianError, MartianErrorName } from './martian';
import {
  LoginResult,
  BindResult,
  UnBindResult,
  unbindAccount,
  ApiErrorName,
} from '../api';
import { signerTypeToAccountTyp } from '../utils';
import { TwitterError } from './twitter';
import { DiscordError } from './discord';
import { MetamaskError } from './metamask';
import { PhantomError } from './phantom';
import { MartianError } from './martian';

export enum SignerType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK = 'METAMASK',
  PHANTOM = 'PHANTOM',
  MARTIAN = 'MARTIAN',
}
const SignerErrorMap = {
  [SignerType.TWITTER]: TwitterError,
  [SignerType.DISCORD]: DiscordError,
  [SignerType.METAMASK]: MetamaskError,
  [SignerType.PHANTOM]: PhantomError,
  [SignerType.MARTIAN]: MartianError,
};
export enum SignerProcessStatus {
  IDLE = 'IDLE',
  SIGNATURE_PENDING = 'SIGNATURE_PENDING',
  SIGNATURE_REJECTED = 'SIGNATURE_REJECTED',
  LOGIN_PENDING = 'LOGIN_PENDING',
  LOGIN_FULFILLED = 'LOGIN_FULFILLED',
  LOGIN_REJECTED = 'LOGIN_REJECTED',
  BIND_PENDING = 'BIND_PENDING',
  BIND_FULFILLED = 'BIND_FULFILLED',
  BIND_REJECTED = 'BIND_REJECTED',
  UNBIND_PENDING = 'UNBIND_PENDING',
  UNBIND_FULFILLED = 'UNBIND_FULFILLED',
  UNBIND_REJECTED = 'UNBIND_REJECTED',
}
export type SignerProcessStatusChange = (
  signerProcessStatus: SignerProcessStatus
) => void;
export abstract class Signer {
  constructor() {}
  abstract readonly signerType: SignerType;
  protected signerProcessStatusChange: SignerProcessStatusChange = () => {};
  public signerProcessStatusChangeListener(
    signerProcessStatusChange: SignerProcessStatusChange
  ) {
    this.signerProcessStatusChange = signerProcessStatusChange;
  }
  public abstract login(): Promise<LoginResult>;

  public abstract bind(token: string): Promise<BindResult>;

  public unbind(token: string): Promise<UnBindResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.UNBIND_PENDING);
      try {
        const accountType = signerTypeToAccountTyp(this.signerType);
        const result = await unbindAccount(token, accountType);
        if (result.data.code === 0) {
          this.signerProcessStatusChange(SignerProcessStatus.UNBIND_FULFILLED);
          resolve(result.data.data);
        } else {
          this.signerProcessStatusChange(SignerProcessStatus.UNBIND_REJECTED);
          const CurrError = SignerErrorMap[this.signerType];
          reject(
            new CurrError(
              ApiErrorName.API_REQUEST_UNBIND_ERROR,
              result.data.msg
            )
          );
        }
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.UNBIND_REJECTED);
        throw error;
      }
    });
  }
}
