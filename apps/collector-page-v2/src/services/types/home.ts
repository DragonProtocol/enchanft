import { ApiResp } from '.';

export type PlatformData = {
  eventNumber: number;
  platform: string;
  platformLogo: string;
  url: string;
};

export type PlatformDataResponse = ApiResp<Array<PlatformData>>;
