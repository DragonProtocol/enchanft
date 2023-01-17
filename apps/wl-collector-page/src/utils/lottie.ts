/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-31 17:24:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-31 17:52:24
 * @Description: file description
 */
import * as claimAnimationData from '../lottie-files/claim/claim.json';
import claim_asset_path_img_0 from '../lottie-files/claim/images/img_0.png';
import claim_asset_path_img_1 from '../lottie-files/claim/images/img_1.png';
import claim_asset_path_img_2 from '../lottie-files/claim/images/img_2.png';
import claim_asset_path_img_3 from '../lottie-files/claim/images/img_3.png';

export type LottieAnimationDataAssetType = {
  id: string;
  w?: number;
  h?: number;
  u?: string;
  p?: string;
  e?: number;
};
export type LottieAnimationDataType = {
  assets?: LottieAnimationDataAssetType[];
  [key: string]: any;
};
export const lottieAnimationDataAssetsAssign = (
  _animationData: LottieAnimationDataType,
  _assets: LottieAnimationDataAssetType[]
): LottieAnimationDataType => {
  const { assets } = _animationData;
  if (assets) {
    for (const asset of assets) {
      const findAsset = _assets.find((v) => v.id === asset.id);
      if (findAsset) {
        Object.assign(asset, findAsset);
      }
    }
  }
  return { ..._animationData, assets };
};
export const getClaimAnimationData = () => {
  const replaceAssets = [
    {
      id: 'image_0',
      u: '',
      p: claim_asset_path_img_0,
    },
    {
      id: 'image_1',
      u: '',
      p: claim_asset_path_img_1,
    },
    {
      id: 'image_2',
      u: '',
      p: claim_asset_path_img_2,
    },
    {
      id: 'image_3',
      u: '',
      p: claim_asset_path_img_3,
    },
  ];
  return lottieAnimationDataAssetsAssign(claimAnimationData, replaceAssets);
};
