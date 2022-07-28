/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 15:36:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-28 15:39:41
 * @Description: file description
 */
// Omit intermediate strings
export const omitIntermediateStr = (str: string, preNum: number, afterNum: number) => {
  const len = str.length
  const front = str.substring(0, preNum)
  const back = str.substring(len - afterNum, len)
  return `${front}${'*'.repeat(len - preNum - afterNum)}${back}`
}
