/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 19:07:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 19:13:51
 * @Description: file description
 */
import {
  selectAllForEvents,
  selectAllForProjects,
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
  return { events, eventIds, projects, projectIds };
};
