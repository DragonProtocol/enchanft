/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-08 18:19:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-26 17:36:35
 * @Description: file description
 */
export const openOauthWindow = (url: string): WindowProxy | null => {
  return window.open(
    url,
    '__blank',
    `width=480,height=800,top=0,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no`
  );
};
export const listenWindowClose = (win: Window, closeCallback: () => void) => {
  const interval = setInterval(function () {
    if (win.closed) {
      clearInterval(interval);
      closeCallback();
    }
  }, 250);
};
