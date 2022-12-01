import { ApiPageResp, ApiResp } from '.';

export type ProjectEntity = {
  id: number;
};
export type ProjectExploreListResponse = ApiPageResp<Array<ProjectEntity>>;
export type ProjectFavoriteListResponse = ApiResp<Array<ProjectEntity>>;
