/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-16 17:12:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-16 17:16:04
 * @Description: file description
 */
export const createClassNamesByTheme = (className: string, theme: string) =>
  `${className} ${className}_${theme}`;
