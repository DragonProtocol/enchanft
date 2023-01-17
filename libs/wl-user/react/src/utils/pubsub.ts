/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-10 22:04:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-25 13:21:27
 * @Description: file description
 */
export default class Pubsub {
  private clientList: any[] = [];

  public listen(key: string | number, fn: any): void {
    if (!fn) return;
    if (!this.clientList[key as number]) {
      this.clientList[key as number] = [];
    }
    this.clientList[key as number].push(fn);
  }

  public trigger(key: string | number, ...arg: any[]): void {
    const fns = this.clientList[key as number];
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
    const fns = this.clientList[key as number];
    if (!fns) {
      return;
    }
    if (!fn) {
      if (fns) fns.length = 0;
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        const f = fns[l];
        if (f === fn) {
          fns.splice(l, 1);
        }
      }
    }
  }
}
