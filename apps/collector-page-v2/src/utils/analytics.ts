/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-19 15:30:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-19 15:33:29
 * @Description: file description
 */
import ReactGA from 'react-ga';

const TRACKING_ID = 'G-0NC4N1Y913';

// Enable debug mode on the local development environment
const isDev = process.env.NODE_ENV === 'development';
ReactGA.initialize(TRACKING_ID, { debug: isDev });

function sendEvent(payload: ReactGA.EventArgs) {
  ReactGA.event(payload);
}

function sendPageview(path: string) {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
}

export default {
  sendEvent,
  sendPageview,
};
