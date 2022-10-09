/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 10:26:01
 * @Description: file description
 */
import { Signer, WlUserError } from '../types';
export interface TwitterConstructorArgs {
  onError?: (error: WlUserError) => void;
}
export class Twitter extends Signer {
  constructor({ onError }: TwitterConstructorArgs) {
    super(onError);
  }

  public async login(): Promise<void> {}
  public async logout(): Promise<void> {}
  public async bindAccount(): Promise<void> {}
  public async unbindAccount(): Promise<void> {}
}
