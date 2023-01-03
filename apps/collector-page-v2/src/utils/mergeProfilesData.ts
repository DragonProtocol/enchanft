import { BigNumber } from 'ethers';
import { ProfileDefault } from '../services/api/profile';
import { ProfileEntity } from '../services/types/profile';

export function mergeProfilesData(
  profilesData: { data: ProfileEntity; wallet: string; chain: string }[]
): ProfileEntity {
  const result: ProfileEntity = JSON.parse(JSON.stringify(ProfileDefault));
  profilesData.forEach(({ data }) => {
    result.erc20Balances = (data.erc20Balances as any).message
      ? [...result.erc20Balances]
      : [...result.erc20Balances, ...data.erc20Balances];

    result.ethBalance = BigNumber.from(result.ethBalance)
      .add(BigNumber.from(data.ethBalance || '0'))
      .toString();

    result.nfts = !data.nfts.result
      ? { ...result.nfts }
      : {
          total: result.nfts.total + data.nfts.total,
          cursor: '',
          result: [...result.nfts.result, ...data.nfts.result],
        };
    result.poap = [...result.poap, ...data.poap];
    result.noox = !data.noox.result
      ? { ...result.noox }
      : {
          total: result.noox.total + data.noox.total,
          result: [...result.noox.result, ...data.noox.result],
        };
    result.galxe = !data.galxe.addressInfo
      ? { ...result.galxe }
      : {
          addressInfo: {
            nfts: {
              totalCount:
                (result.galxe.addressInfo?.nfts.totalCount || 0) +
                (data.galxe.addressInfo?.nfts.totalCount || 0),
              pageInfo: result.galxe.addressInfo?.nfts.pageInfo,
              list: [
                ...(result.galxe.addressInfo?.nfts.list || []),
                ...(data.galxe.addressInfo?.nfts.list || []),
              ],
            },
          },
        };
  });
  return result;
}
