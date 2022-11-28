/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-23 14:39:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-23 14:57:48
 * @Description: file description
 */
export const WL_MOD_HOST = process.env.REACT_APP_WL_MOD_HOST;

export const toWlModPageTaskDetail = (taskId: number, projectSlug: string) => {
  window.open(`${WL_MOD_HOST}/project/${projectSlug}/task/${taskId}`);
};
export const toWlModPageTaskCreate = (projectSlug: string) => {
  window.open(`${WL_MOD_HOST}/project/${projectSlug}/task/new`);
};
