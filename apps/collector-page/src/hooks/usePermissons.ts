import { useCallback, useEffect, useMemo, useState } from 'react'
import { selectAccount, RoleType } from '../features/user/accountSlice'
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

  // TODO
  const checkTaskAllowed = useMemo(async () => {
    return true
  }, [account])

  return {
    isCreator,
    checkTaskAllowed,
  }
}
