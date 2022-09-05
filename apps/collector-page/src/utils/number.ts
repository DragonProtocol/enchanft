/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-05 11:53:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-05 12:15:06
 * @Description: file description
 */
export enum UnitStringCriticalNumber {
  w = 100000,
  k = 1000,
}
export const formatNumberToUnitString = (num: number): string | number => {
  if (num > UnitStringCriticalNumber.w) {
    return num / UnitStringCriticalNumber.w + 'w'
  } else if (num > UnitStringCriticalNumber.k) {
    return num / UnitStringCriticalNumber.k + 'k'
  }
  return num
}
