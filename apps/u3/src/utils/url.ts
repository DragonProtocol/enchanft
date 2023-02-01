/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-01 13:15:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 16:06:40
 * @Description: file description
 */
export function getDomainNameByUrl(url: string) {
  const host = new URL(url).hostname;
  const parts = host.split('.');
  return parts.at(-2);
}
