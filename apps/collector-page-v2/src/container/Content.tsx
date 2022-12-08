/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 17:02:09
 * @Description: content container
 */
import ContentShower from '../components/contents/ContentShower';
import { ContentListItem } from '../services/types/contents';
import { useVoteUp } from '../hooks/useVoteUp';
import userFavored from '../hooks/useFavored';
import { getContentWithJsonValue } from '../utils/content';

export type ContentContainerProps = {
  data: ContentListItem;
  onHidden: () => void;
};
function Content({ data, onHidden }: ContentContainerProps) {
  const vote = useVoteUp(data?.id, data?.upVoted);
  const favors = userFavored(data?.id, data?.favored);

  return (
    <ContentShower
      {...data}
      content={getContentWithJsonValue(data.value)}
      voteAction={vote}
      favorsActions={favors}
      hiddenAction={onHidden}
    />
  );
}
export default Content;
