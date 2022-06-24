/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-24 10:49:22
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-24 11:51:09
 * @FilePath: \synft-app\src\types\api\launchpad.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 项目方信息
export type ProjectPartyItem = {
  id: string
  name: string
}
// 项目信息
export type ProjectItem = {
  id: string
  img: string
  name: string
  homeUrl: string
  twitterUrl: string
  discordUrl: string
  desc: string
  itemsNum: number
  price: number
  enchanfted: number
  projectParty: ProjectPartyItem
}
