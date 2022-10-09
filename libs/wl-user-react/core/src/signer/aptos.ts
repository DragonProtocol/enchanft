/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 10:25:10
 * @Description: file description
 */
import { Signer, WlUserError } from '../types';
import { windowObj } from '../utils';
import { ethers } from 'ethers';
type AptosProvider = typeof ethers.providers.Web3Provider & {
  provider: any;
  publicKeyStr: string;
};
export interface AptosConstructorArgs {
  onError?: (error: WlUserError) => void;
}
export class Aptos extends Signer {
  constructor({ onError }: AptosConstructorArgs) {
    super(onError);
  }

  private provider?: AptosProvider;

  private async getProvider() {
    if (windowObj?.ethereum) {
      const provider = new ethers.providers.Web3Provider(windowObj.ethereum);
      await provider.send('eth_requestAccounts', []);
    } else {
      return null;
    }
  }
  public async login(): Promise<void> {}
  public async logout(): Promise<void> {}
  public async bindAccount(): Promise<void> {}
  public async unbindAccount(): Promise<void> {}
}
