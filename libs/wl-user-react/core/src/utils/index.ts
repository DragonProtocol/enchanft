/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 18:19:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-08 18:23:45
 * @Description: file description
 */
export const windowObj: typeof window & {
  ethereum?: any;
  solana?: any;
} = window;
