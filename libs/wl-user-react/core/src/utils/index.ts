/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 18:19:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-13 12:32:11
 * @Description: file description
 */
export const openOauthWindow = (url: string): WindowProxy | null => {
  return window.open(
    url,
    '__blank',
    `width=480,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no`
  );
};
