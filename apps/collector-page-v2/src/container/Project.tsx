/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 19:41:36
 * @Description: 首页任务看板
 */
import { useParams } from 'react-router-dom';
import ProjectDetailCard from '../components/project/ProjectDetailCard';
import { selectById } from '../features/project/projectExploreList';
import { useAppSelector } from '../store/hooks';
import { selectAll as selecteAllFovored } from '../features/project/userFavoredProjects';

function Project() {
  const params = useParams();
  const data = useAppSelector((state) => selectById(state, params.id));
  const favoredIds = useAppSelector(selecteAllFovored).map((item) => item.id);
  const onEventComplete = () => {};
  const onShare = () => {};
  const onFavor = () => {};
  return (
    <ProjectDetailCard
      data={data}
      onEventComplete={onEventComplete}
      onShare={onShare}
      onFavor={onFavor}
    />
  );
}
export default Project;
