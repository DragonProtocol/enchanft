import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
import { URLQueryParams } from 'object-in-queryparams';
import { ethers } from 'ethers';

import { State as CreateTaskState } from '../Components/TaskCreate/type';
import { PerPageSize } from '../utils/constants';
import { CoinType } from '../utils/token';

const fileDownload = require('js-file-download');
const ApiBaseUrl = process.env.REACT_APP_API_BASE_URL;
console.log({ ApiBaseUrl });

export type ApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export enum ChainType {
  SOLANA = 'SOLANA',
  EVM = 'EVM',
  APTOS = 'APTOS',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD',
}

export enum AsyncRequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export type AccountLink = {
  accountType: ChainType;
  id: 187;
  thirdpartyId: '3VBhW51tUBzZfWpSv5fcZww3sMtcPoYq55k38rWPFsvi';
  thirdpartyName: '';
  userId: 63;
};
export type LoginResult = {
  token: string;
  id: number;
  name: string;
  avatar: string;
  accounts: AccountLink[];
  roles: ['COLLECTOR'];
  resourcePermissions: [];
};
export function login(params: {
  signature: string;
  payload: string;
  pubkey: string;
  type: ChainType;
}): AxiosPromise<LoginResult> {
  console.log('loginParams', params);
  return axios({
    url: `${ApiBaseUrl}/users/login`,
    method: 'post',
    data: params,
  });
}

export function getProfile(token: string): AxiosPromise<ApiResp<LoginResult>> {
  return axios({
    url: ApiBaseUrl + '/users/profile',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadImage(file: File, token: string) {
  const form = new FormData();
  form.append('file', file);
  return axios({
    url: ApiBaseUrl + '/medium/upload',
    method: 'post',
    data: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function checkTweetIdValid(tweetId: string, token: string) {
  return axios({
    url: ApiBaseUrl + `/users/twitter?tweetId=${tweetId}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function checkTwitterNameValid(name: string, token: string) {
  return axios({
    url: ApiBaseUrl + `/users/twitter?name=${name}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function linkAccount(
  params: {
    type: ChainType;
    signature: string;
    payload: string;
    pubkey: string;
  },
  token: string
) {
  const data = qs.stringify(params);
  return axios({
    url: ApiBaseUrl + '/users/link',
    method: 'post',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchDetailByProjectSlug(
  slug: string,
  token: string
): AxiosPromise<ApiResp<any>> {
  return axios({
    url: ApiBaseUrl + `/projects/${slug}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export enum Chain {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  APTOS = 'APTOS',
}

export function createTask(data: CreateTaskState, token: string) {
  const postData = {
    projectId: data.projectId,
    name: data.name,
    description: data.description,
    image: data.image,
    winNum: data.winnerNum,
    startTime: data.startTime,
    endTime: data.endTime,
    reward: {
      type: data.reward.type,
      raffled: data.reward.raffled,
      name: data.reward.name,
      luckyDraw: data.reward.luckyDraw,
      data: {
        token_num: data.reward.token_num,
      },
    },
    actions: data.actions.map((item) => {
      let chain;
      if (item.coin_type === CoinType.APT) {
        chain = Chain.APTOS;
      }
      if (item.coin_type === CoinType.ETH) {
        chain = Chain.EVM;
      }
      if (item.coin_type === CoinType.SOL) {
        chain = Chain.SOLANA;
      }
      return {
        name: item.name,
        type: item.typeMore,
        description: item.description,
        data: {
          url: item.url,
          server_id: item.server_id,
          require_score: item.require_score,
          num: item.num,
          accounts: item.accounts,
          tweet_id: item.tweet_id,
          role: item.role,
          min_native_balance: item.min_native_balance,
          nft_accounts: item.nft_accounts,
          nft_accounts_or_add: item.nft_accounts_or_add,
          question: item.question,
          answer: item.answer,
          lucky_draw_weight: item.lucky_draw_weight,
          chain,
        },
      };
    }),
  };

  return axios({
    url: ApiBaseUrl + `/tasks`,
    method: 'post',
    data: postData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function creatorApi(taskId: number, token: string) {
  return axios({
    url: ApiBaseUrl + `/creator/dashboard/${taskId}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function saveWinnersApi(params: any, token: string) {
  const data = qs.stringify(params);
  return axios({
    url: ApiBaseUrl + '/creator/save/',
    method: 'post',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function downloadWinner(type: string, taskId: string, token: string) {
  axios({
    url: ApiBaseUrl + `/creator/download/${type}/${taskId}.csv`,
    method: 'get',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    fileDownload(
      response.data,
      `${type}.csv`,
      'text/csv;charset=utf-8',
      '\uFEFF'
    );
  });
}

export function creatorProjectApi(token: string) {
  return axios({
    url: ApiBaseUrl + '/creator/projects',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function projectBindBot({
  projectId,
  discordId,
  token,
}: {
  projectId: number;
  discordId: string;
  token: string;
}) {
  return axios({
    url: ApiBaseUrl + `/projects/${projectId}/binding`,
    method: 'post',
    data: {
      discordId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function linkSocial(params: any, token: string) {
  const data = qs.stringify(params);
  return axios({
    url: ApiBaseUrl + '/users/link',
    method: 'post',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getTwitterSubScriptions(token: string) {
  return axios({
    url: ApiBaseUrl + '/twitter/pin-urls',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function bindTwitterSubScription(
  params: {
    pin: string;
    oauthToken: string;
    oauthTokenSecret: string;
    communityId: number;
  },
  token: string
) {
  return axios({
    url: ApiBaseUrl + '/twitter/subscriptions',
    method: 'post',
    data: {
      ...params,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createProject(
  params: {
    name: string;
    desc: string;
    minted: boolean;
    chainId: number;
    image: string;
  },
  token: string
) {
  console.log('createProject', params, token);
  return axios({
    url: ApiBaseUrl + '/creator/project',
    method: 'post',
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateProject(params: any, token: string) {
  console.log('updateProject', params, token);
  return axios({
    url: ApiBaseUrl + '/creator/setProject',
    method: 'post',
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function addAccount(params: any, token: string) {
  return updateProject(params, token);
}

export function delAccount(params: any, token: string) {
  return updateProject(params, token);
}

export function creatorTwitter(
  params: {
    code: string;
    callback: string;
    projectId: number;
    communityId: number;
  },
  token: string
) {
  return axios({
    url: ApiBaseUrl + '/creator/twitter',
    method: 'post',
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export type Member = {
  contributionToken: 0;
  discordConnected: false;
  discordId: null;
  discordName: null;
  hasWhiteList: true;
  id: 1;
  twitterConnected: false;
  twitterId: null;
  twitterName: null;
  userAvatar: '';
  userId: 106;
  userName: '';
  wallet: string;
  walletConnected: true;
};

export type MemberFilter = {
  contributionToken?: number;
  hasWhiteList?: boolean;
  isNftHolder?: boolean;
  walletConnected?: boolean;
  twitterConnected?: boolean;
  discordConnected?: boolean;
  walletBalance?: string;
  twitterFollowerNum?: number;
  isTwitterFollower?: boolean;
  discordRole?: string;
  isDiscordMember?: boolean;
  nftWhales?: string[];
  walletSearch?: string;
};

export const PageSize = PerPageSize;
export function creatorMembersWithFilter(
  projectId: number,
  params: MemberFilter,
  token: string,
  pageNumber = 0,
  pageSize = PageSize
): AxiosPromise<{
  code: number;
  msg: string;
  data: {
    members: Member[];
    totalNumber: number;
  };
}> {
  let data = '';
  for (const key in params) {
    let v = '';
    if (key === 'nftWhales' && params['nftWhales']) {
      v = new URLQueryParams({
        nftWhales: params['nftWhales'],
      }).toString();
    } else if (key === 'walletBalance' && params['walletBalance']) {
      const wei = ethers.utils.parseUnits(params['walletBalance'], 'ether');
      // console.log(params['walletBalance'], wei);
      v = `${key}=${wei.toString()}`;
    } else {
      v = `${key}=${params[key as keyof MemberFilter]}`;
    }
    data += v + '&';
  }
  data += `pageNumber=${pageNumber}&pageSize=${pageSize}`;

  return axios({
    url: ApiBaseUrl + `/creator/members/${projectId}?${data}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function creatorMembersInsert(
  projectId: number,
  file: File,
  token: string
) {
  const form = new FormData();
  form.append('file', file);
  return axios({
    url: ApiBaseUrl + `/creator/members/${projectId}`,
    method: 'post',
    data: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function creatorMembersDownloadWithFilter(
  projectId: number,
  params: MemberFilter,
  token: string
) {
  let data = '';
  for (const key in params) {
    let v = '';
    if (key === 'nftWhales' && params['nftWhales']) {
      v = new URLQueryParams({
        nftWhales: params['nftWhales'],
      }).toString();
    } else {
      v = `${key}=${params[key as keyof MemberFilter]}`;
    }
    data += v + '&';
  }

  axios({
    url: ApiBaseUrl + `/creator/members/${projectId}/csv?${data}`,
    method: 'get',
    // : list,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    fileDownload(
      response.data,
      `members.csv`,
      'text/csv;charset=utf-8',
      '\uFEFF'
    );
  });
}

export function creatorMemberTempDownload(token: string) {
  axios({
    url: ApiBaseUrl + `/creator/members/0/csv`,
    method: 'get',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    fileDownload(
      response.data,
      `members-template.csv`,
      'text/csv;charset=utf-8',
      '\uFEFF'
    );
  });
}
