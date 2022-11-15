/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-10 22:04:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-10 22:52:42
 * @Description: file description
 */
export class Pubsub {
  constructor() {}
  private clientList = [];
  public listen(key: string | number, fn: any): void {
    if (!fn) return;
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  }
  public trigger(key: string | number, ...arg: any[]): void {
    const fns = this.clientList[key];
    if (!fns || fns.length === 0) {
      return;
    }
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      if (fn) {
        fn(...arg);
      }
    }
  }
  public remove(key: string | number, fn: any): void {
    const fns = this.clientList[key];
    if (!fns) {
      return;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        const _fn = fns[l];
        if (_fn === fn) {
          fns.splice(l, 1);
        }
      }
    }
  }
}
