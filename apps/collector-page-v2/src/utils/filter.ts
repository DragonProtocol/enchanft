/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-10 15:40:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 15:45:44
 * @Description: file description
 */
const noFormatShowNameAry = ['POAP', 'NFT', 'WL', 'DAO'];
export const formatFilterShowName = (str: string) => {
  return str
    .split('_')
    .map((item) => {
      if (noFormatShowNameAry.includes(item)) {
        return item;
      }
      const s = item.toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join(' ');
};
