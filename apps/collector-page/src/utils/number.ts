/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-05 11:53:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-07 10:13:22
 * @Description: file description
 */
export enum UnitStringCriticalNumber {
  w = 100000,
  k = 1000,
}
export const formatNumberToUnitString = (num: number): string | number => {
  if (num > UnitStringCriticalNumber.w) {
    return num / 10000 + 'w'
  } else if (num > UnitStringCriticalNumber.k) {
    return num / 1000 + 'k'
  }
  return num
}
