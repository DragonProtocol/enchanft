import { ApiResp } from '.';

export enum ContentLang {
  All = 'All', // only for UI
  English = 'EN',
  中文 = 'CN',
}

export enum ContentLangRev {
  EN = 'English',
  CN = '中文',
}

export enum ContentStatus {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
}

export enum ContentType {
  NEWS = 'News',
  GAMING = 'Gaming',
  DEFI = 'Defi',
  NFTS = 'Nfts',
  READS = 'Reads',
  POADCAST_NOTES = 'Poadcast notes',
  ANNOUNCEMENT = 'Announcement',
}

export enum OrderBy {
  // EARLIEST = 'Earliest',
  TRENDING = 'Trending',
  NEWEST = 'Newest',
  FORU = 'For U',
  MEMPOOL = 'Mem Pool',
}

export type ContentListItem = {
  uid?: string;
  // action?: { linkUrl: string };
  imageUrl?: string;
  uniProjects: Array<{
    description: string;
    favored: boolean;
    id: number;
    image: string;
    name: string;
  }>;
  uuid?: string;
  id: number;
  title: string;
  createdAt: number;
  value: string;
  author: string;
  description: string;
  chain: 'ETH';
  link: string;
  upVoteNum: number;
  type: string;
  platform: {
    logo: string;
  };
  supportReaderView?: boolean;
  supportIframe?: boolean;
  upVoted: boolean;
  favored: boolean;
  hidden: boolean;
  uniProject: {
    id: 1;
    description: string;
    name: string;
    image: string;
  };
  isForU?: boolean;
  editorScore: null | number;
};

export type ContentsListResponse = ApiResp<Array<ContentListItem>>;

export type URLParseResponse = ApiResp<{
  title: string;
  content: string;
  // byline: null;
  // dir: null;
  excerpt: string;
  lang: string;
  length: number;
  // siteName: null;
  textContent: string;
}>;

export type Project = {
  favored: boolean;
  id: number;
  image: string;
  name: string;
};
export type ContentsResponse = ApiResp<Array<Project>>;
