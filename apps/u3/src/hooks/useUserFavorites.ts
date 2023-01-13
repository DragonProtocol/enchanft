/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 19:07:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 14:56:47
 * @Description: file description
 */
import {
  selectAllForContents,
  selectAllForEvents,
  selectAllForProjects,
  selectIdsForContents,
  selectIdsForEvents,
  selectIdsForProjects,
} from '../features/favorite/userGroupFavorites';
import { useAppSelector } from '../store/hooks';

export default () => {
  const events = useAppSelector(selectAllForEvents);
  const eventIds = useAppSelector(selectIdsForEvents).map((id) => Number(id));
  const projects = useAppSelector(selectAllForProjects);
  const projectIds = useAppSelector(selectIdsForProjects).map((id) =>
    Number(id)
  );
  const contents = useAppSelector(selectAllForContents);
  const contentIds = useAppSelector(selectIdsForContents).map((id) =>
    Number(id)
  );
  return { events, eventIds, projects, projectIds, contents, contentIds };
};
