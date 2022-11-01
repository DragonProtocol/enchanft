/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-29 18:31:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 00:16:42
 * @Description: file description
 */
import {
  LoginResult,
  BindResult,
  UnBindResult,
  unbindAccount,
  ApiErrorName,
  ApiError,
  AccountType,
} from '../api';

export enum SignerType {
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
  METAMASK = 'METAMASK',
  PHANTOM = 'PHANTOM',
  MARTIAN = 'MARTIAN',
}
export enum SignerProcessStatus {
  IDLE = 'IDLE',
  SIGNATURE_PENDING = 'SIGNATURE_PENDING',
  SIGNATURE_FULFILLED = 'SIGNATURE_FULFILLED',
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
  abstract readonly accountType: AccountType;
  protected signerProcessStatusChange: SignerProcessStatusChange = () => {};
  public signerProcessStatusChangeListener(
    callback: SignerProcessStatusChange
  ) {
    this.signerProcessStatusChange = callback;
  }
  public abstract login(): Promise<LoginResult>;

  public abstract bind(token: string): Promise<BindResult>;

  public unbind(token: string): Promise<UnBindResult> {
    return new Promise(async (resolve, reject) => {
      this.signerProcessStatusChange(SignerProcessStatus.UNBIND_PENDING);
      try {
        const result = await unbindAccount(token, this.accountType);
        if (result.data) {
          this.signerProcessStatusChange(SignerProcessStatus.UNBIND_FULFILLED);
          resolve(result.data);
        } else {
          this.signerProcessStatusChange(SignerProcessStatus.UNBIND_REJECTED);
          reject(
            new ApiError(
              ApiErrorName.API_REQUEST_UNBIND_ERROR,
              'unbind result data is null'
            )
          );
        }
      } catch (error) {
        this.signerProcessStatusChange(SignerProcessStatus.UNBIND_REJECTED);
        reject(
          new ApiError(ApiErrorName.API_REQUEST_UNBIND_ERROR, error.message)
        );
      }
    });
  }
}
