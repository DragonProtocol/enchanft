/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-19 11:29:58
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-21 16:38:10
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import { useWlUserReact } from './provider';
import { ResourceType, RoleType } from '@ecnft/wl-user-core';

export function usePermissions() {
  const { user } = useWlUserReact();
  const isCreator = useMemo(
    () => user.roles.includes(RoleType.CREATOR),
    [user.roles]
  );
  const isAdmin = useMemo(
    () => user.roles.includes(RoleType.ADMIN),
    [user.roles]
  );
  const isVIP = useMemo(() => user.roles.includes(RoleType.VIP), [user.roles]);

  const checkTaskAllowed = useCallback(
    (taskId: number) => {
      const hasTaskPermission = !!user.resourcePermissions
        .find((item) => item.resourceType === ResourceType.TASK)
        ?.resourceIds.includes(taskId);
      return hasTaskPermission;
    },
    [user]
  );

  const checkProjectAllowed = useCallback(
    (projectId: number) => {
      const hasProjectPermission = !!user.resourcePermissions
        .find((item) => item.resourceType === ResourceType.PROJECT)
        ?.resourceIds.includes(projectId);

      return hasProjectPermission;
    },
    [user]
  );

  // TODO 待确认传参，和resourceType
  const checkContributionAllowed = useCallback(
    (communityId: number) => {
      const hasProjectPermission = !!user.resourcePermissions
        .find((item) => item.resourceType === ResourceType.COMMUNITY)
        ?.resourceIds.includes(communityId);

      return hasProjectPermission;
    },
    [user]
  );

  return {
    isCreator,
    isAdmin,
    isVIP,
    checkTaskAllowed,
    checkProjectAllowed,
    checkContributionAllowed,
  };
}
