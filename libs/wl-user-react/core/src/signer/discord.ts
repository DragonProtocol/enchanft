/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 16:00:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 10:25:53
 * @Description: file description
 */
import { Signer, WlUserError } from '../types';
export interface DiscordConstructorArgs {
  onError?: (error: WlUserError) => void;
}
export class Discord extends Signer {
  constructor({ onError }: DiscordConstructorArgs) {
    super(onError);
  }

  public async login(): Promise<void> {}
  public async logout(): Promise<void> {}
  public async bindAccount(): Promise<void> {}
  public async unbindAccount(): Promise<void> {}
}
