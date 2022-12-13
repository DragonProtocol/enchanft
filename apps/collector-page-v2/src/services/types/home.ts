import { ApiResp } from '.';

export type PlatformData = {
  eventNumber: number;
  platform: string;
  platformLogo: string;
};

export type PlatformDataResponse = ApiResp<Array<PlatformData>>;
