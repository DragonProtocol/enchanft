import { useCallback, useEffect, useMemo, useState } from 'react'
import { selectAccount, RoleType, ResourceType } from '../features/user/accountSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function usePermissions() {
  //   const dispatch = useAppDispatch()
  const [isCreator, setIsCreator] = useState(false)
  const account = useAppSelector(selectAccount)

  useEffect(() => {
    if (account.roles.includes(RoleType.CREATOR)) {
      setIsCreator(true)
    }
  }, [account.roles])

  const checkTaskAllowed = useCallback(
    (taskId: number) => {
      const hasTaskPermission = !!account.resourcePermissions
        .find((item) => item.resourceType === ResourceType.TASK)
        ?.resourceIds.includes(taskId)
      return hasTaskPermission
    },
    [account],
  )

  const checkProjectAllowed = useCallback(
    (projectId: number) => {
      const hasProjectPermission = !!account.resourcePermissions
        .find((item) => item.resourceType === ResourceType.PROJECT)
        ?.resourceIds.includes(projectId)

      return hasProjectPermission
    },
    [account],
  )

  return {
    isCreator,
    checkTaskAllowed,
    checkProjectAllowed,
  }
}
