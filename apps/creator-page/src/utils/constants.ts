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
export const WL_HOST = process.env.REACT_APP_WL_HOST;

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

export const PerPageSize = 20;
export const Whales: { [index: string]: string } = {
  CryptoPunks: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
  'Bored Ape Yacht Cl': '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  'Mutant Ape Yacht Club': '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
  'Otherdeed for Otherside': '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258',
  Azuki: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
  'CLONE X - X TAKASHI MURAKAMI': '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
  Moonbirds: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
  Decentraland: '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
  'The Sandbox': '0x5CC5B05a8A13E3fBDB0BB9FcCd98D38e50F90c38',
  Doodles: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
  Meebits: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7',
  'Cool Cats NFT': '0x1A92f7381B9F03921564a437210bB9396471050C',
  'Bored Ape Kennel Club': '0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623',
  'Loot (for Adventurers)': '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
  'World of Women': '0xe785E82358879F061BC3dcAC6f0444462D4b5330',
  'goblintown.wtf': '0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e',
  'CrypToadz by GREMPLIN': '0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6',
  'Murakami.Flowers Seed': '0x341A1c534248966c4b6AFaD165B98DAED4B964ef',
  'Invisible Friends': '0x59468516a8259058baD1cA5F8f4BFF190d30E066',
  mfers: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
  'Pudgy Penguins': '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8',
  'Bored Ape Chemistry Club': '0x22c36BfdCef207F9c0CC941936eff94D4246d14A',
  VeeFriends: '0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB',
  'FLUF World': '0xCcc441ac31f02cD96C153DB6fd5Fe0a2F4e6A68d',
  'RTFKT - MNLTH': '0x86825dFCa7A6224cfBd2DA48e85DF2fc3Aa7C4B1',
  'NFT Worlds': '0xBD4455dA5929D5639EE098ABFaa3241e9ae111Af',
  'RTFKT - CloneX Mintvial': '0x348FC118bcC65a92dC033A951aF153d14D945312',
  'CyberKongz (Babies)': '0x57a204AA1042f6E66DD7730813f4024114d74f37',
  'Creepz Genesis': '0xfE8C6d19365453D26af321D0e8c910428c23873F',
  Deadfellaz: '0x2acAb3DEa77832C09420663b0E1cB386031bA17B',
  'Ringers by Dmitri Cherniak': '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
  CyberKongz: '0x57a204AA1042f6E66DD7730813f4024114d74f37',
  'Gutter Cat Gang': '0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452',
  'Wolf Game': '0x7F36182DeE28c45dE6072a34D29855BaE76DBe2f',
  'Damien Hirst - The Currency': '0xaaDc2D4261199ce24A4B0a57370c4FCf43BB60aa',
  'PROOF Collective': '0x08D7C0242953446436F34b4C78Fe9da38c73668d',
  'CryptoPunks V1 (wrapped)': '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D',
  Autoglyphs: '0xd4e4078ca3495DE5B1d4dB434BEbc5a986197782',
  'Murakami.Flowers Official': '0x7D8820FA92EB1584636f4F5b8515B5476B75171a',
};
