export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const MEDIA_BREAK_POINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1024,
  xxl: 1280,
  xxxl: 1440,
};
export const MOBILE_BREAK_POINT = 768;

export const TASK_DEFAULT_IMAGE_URLS = [
  'https://res.cloudinary.com/wl-xyz/image/upload/v1661230579/assets/0.jpg',
  'https://res.cloudinary.com/wl-xyz/image/upload/v1661230579/assets/1.jpg',
  'https://res.cloudinary.com/wl-xyz/image/upload/v1661230579/assets/2.jpg',
  'https://res.cloudinary.com/wl-xyz/image/upload/v1661230579/assets/3.jpg',
];

export const TASK_DEFAULT_IMAGE_URL = TASK_DEFAULT_IMAGE_URLS[1];
export const TASK_SHARE_URI = process.env.REACT_APP_TASK_SHARE_URI;

export const CREATE_TASK_DEFAULT_WINNER_NUM = 20;
export const CREATE_TASK_DEFAULT_INVITE_NUM = 5;
export const CREATE_TASK_DEFAULT_CONTRIBUTION_TOKEN = 20;

export const WL_INFO_URL = 'https://info.wl.xyz';
export const WL_TWITTER_URL = 'https://twitter.com/realwlxyz';
export const WL_DISCORD_URL = 'https://discord.com/invite/ZXEgc3UrjB';

export const WL_APP_VERSION = process.env.REACT_APP_VERSION;

export const TASK_IMAGE_SIZE_LIMIT = 1 * 1024 * 1024;
export const AVATAR_SIZE_LIMIT = 200 * 1024;

export const SHARE_EVENT_TWEET_CONTENTS =
  'I am exploring on WL.xyz follow the link to find answer with me.\n';
