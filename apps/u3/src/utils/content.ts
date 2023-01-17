/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 16:58:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 17:00:19
 * @Description: file description
 */
export const getContentWithJsonValue = (value: string) => {
  if (!value) return '';
  try {
    const content = JSON.parse(value);
    return content.content;
  } catch (error) {
    return value;
  }
};
