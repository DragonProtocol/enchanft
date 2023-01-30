/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-19 11:53:04
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../../services/types/project';
import Loading from '../../common/loading/Loading';
import DappExploreListItem from '../DappExploreListItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemResponse[];
  loading?: boolean;
  onItemClick?: (data: ProjectExploreListItemResponse) => void;
};
export default function RecommendDapps({
  data,
  loading,
  onItemClick,
  ...otherProps
}: Props) {
  return (
    <RecommendDappsWrapper {...otherProps}>
      <CardTitle>Recommended</CardTitle>
      {loading ? (
        <ListStatusBox>
          <Loading />
        </ListStatusBox>
      ) : (
        <RecommendDappsList>
          {data.map((item) => (
            <RecommendDappItem
              key={item.id}
              data={item}
              displayButtons={false}
              onClick={() => onItemClick && onItemClick(item)}
            />
          ))}
        </RecommendDappsList>
      )}
    </RecommendDappsWrapper>
  );
}

const RecommendDappsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
  display: flex;
  flex-direction: column;
`;
const RecommendDappsList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const RecommendDappItem = styled(DappExploreListItem)`
  padding: 0;
`;
const ListStatusBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
