/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-23 11:24:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-23 11:25:01
 * @Description: file description
 */
export const formatDateTime = (timestramp: number) => {
  return new Date(timestramp).toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
