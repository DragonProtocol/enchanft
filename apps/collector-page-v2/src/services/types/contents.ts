import { ApiPageResp } from '.';

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
  EARLIEST = 'Earliest',
  TRENDING = 'Trending',
  NEWEST = 'Newest',
  FORU = 'For U',
}

export type ContentListItem = {
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
  upVoted: boolean;
  favored: boolean;
  uniProject: {
    id: 1;
    description: string;
    name: string;
    image: string;
  };
};

export type ContentsListResponse = ApiPageResp<Array<ContentListItem>>;
